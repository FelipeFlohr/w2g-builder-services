package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.configurations.DownloaderWebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DownloaderFailureDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoDownloadedDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileReferenceRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import dev.felipeflohr.w2gservices.builder.types.DownloaderApplicationAddressesType
import dev.felipeflohr.w2gservices.builder.utils.Either
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import dev.felipeflohr.w2gservices.builder.utils.URLUtils
import jakarta.annotation.PostConstruct
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

@Service
class MessageFileReferenceServiceImpl @Autowired constructor(
    private val messageService: DiscordMessageService,
    @Qualifier(DownloaderWebClientConfiguration.DOWNLOADER_WEB_CLIENT_BEAN_NAME) private val downloaderWebClient: WebClient,
    private val repository: MessageFileReferenceRepository,
    private val messageFileLogService: MessageFileLogService,
) : MessageFileReferenceService {
    private val logger = LoggerUtils.getLogger(MessageFileReferenceService::class)

    @PostConstruct
    private fun init() {
        runBlocking {
            val messages = messageService.getAllMessagesWithNoFileReference()
            downloadAndSaveDiscordMessages(messages)
        }
    }

    override suspend fun downloadAndSaveDiscordMessages(messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> = coroutineScope {
        val videos = downloadVideos(messages)
        val entities = createEntityListFromResponseDTO(videos, messages)
        return@coroutineScope saveListOfFileEntities(entities)
    }

    suspend fun downloadVideos(videos: List<DiscordMessageEntity>): DownloaderVideoBatchResponseDTO {
        val urls = videos
            .map { video -> video.content }
            .map { content -> URLUtils.getUrlsFromString(content) }
            .reduce { acc, curr -> acc + curr }

        val video = downloaderWebClient
            .post()
            .uri(DownloaderApplicationAddressesType.DOWNLOAD_VIDEO.address)
            .body(BodyInserters.fromValue(urls))
            .retrieve()
            .toEntity(DownloaderVideoBatchResponseDTO::class.java)
            .awaitFirst()

        if (video.body == null || video.statusCode.isError) {
            val msg = "Not possible to download video. Status: ${video.statusCode.value()} | Body: ${video.body}"
            logger.error(msg)
            throw RuntimeException(msg)
        }

        return video.body!!
    }

    suspend fun saveListOfFileEntities(entities: List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val references: List<MessageFileReferenceEntity> = entities
            .filterIsInstance(Either.Left::class.java)
            .map { entity -> entity.value as MessageFileReferenceEntity }
        val failures: List<MessageFileLogEntity> = entities
            .filterIsInstance(Either.Right::class.java)
            .map { entity -> entity.value as MessageFileLogEntity }

        val flushedReferences = saveAllAndFlush(references)
        val flushedFailures = messageFileLogService.saveAllAndFlush(failures)
        return createEitherListFromEntities(flushedReferences, flushedFailures)
    }

    private fun createEntityListFromResponseDTO(res: DownloaderVideoBatchResponseDTO, messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val downloadedVideos = createMapOfDownloadedVideoAndMessageEntity(res, messages)
        val failedVideos = createMapOfFailedDownloadsAndMessageEntity(res, messages)

        val references = downloadedVideos
            .map { entry -> createMessageFileReferenceEntity(entry.key, entry.value) }
        val logs = failedVideos
            .map { entry -> createMessageFileLogEntity(entry.key, entry.value) }
        return createEitherListFromEntities(references, logs)
    }

    private fun createMapOfDownloadedVideoAndMessageEntity(res: DownloaderVideoBatchResponseDTO, messages: List<DiscordMessageEntity>): Map<DownloaderVideoDownloadedDTO, DiscordMessageEntity> {
        val responseMap: MutableMap<DownloaderVideoDownloadedDTO, DiscordMessageEntity> = HashMap()
        res.downloaded.forEach { downloaded ->
            val messageEntity = findMessageEntityContainingUrl(messages, downloaded.url)
            if (messageEntity != null) {
                responseMap[downloaded] = messageEntity
            }
        }

        return responseMap
    }

    private fun createMapOfFailedDownloadsAndMessageEntity(res: DownloaderVideoBatchResponseDTO, messages: List<DiscordMessageEntity>): Map<DownloaderFailureDTO, DiscordMessageEntity> {
        val responseMap: MutableMap<DownloaderFailureDTO, DiscordMessageEntity> = HashMap()
        res.failure.forEach { failure ->
            val messageEntity = findMessageEntityContainingUrl(messages, failure.url)
            if (messageEntity != null) {
                responseMap[failure] = messageEntity
            }
        }

        return responseMap
    }

    private fun findMessageEntityContainingUrl(messages: List<DiscordMessageEntity>, url: String): DiscordMessageEntity? {
        return messages.find { message ->
            val urls = URLUtils.getUrlsFromString(message.content)
            return@find urls
                .any { urlFromMessage -> urlFromMessage.equals(url, true) }
        }
    }

    private fun createMessageFileReferenceEntity(videoDownloadedDTO: DownloaderVideoDownloadedDTO, message: DiscordMessageEntity): MessageFileReferenceEntity {
        return MessageFileReferenceEntity(
            id = null,
            message = message,
            fileHash = videoDownloadedDTO.fileHash,
            url = videoDownloadedDTO.url,
        )
    }

    private fun createMessageFileLogEntity(videoFailureDTO: DownloaderFailureDTO, message: DiscordMessageEntity): MessageFileLogEntity {
        return MessageFileLogEntity(
            body = videoFailureDTO.error,
            message = message,
        )
    }

    private fun createEitherListFromEntities(references: List<MessageFileReferenceEntity>, logs: List<MessageFileLogEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val result: MutableList<Either<MessageFileReferenceEntity, MessageFileLogEntity>> = ArrayList()
        references
            .forEach { either -> result.addLast(Either.Left(either)) }
        logs
            .forEach { either -> result.addLast(Either.Right(either)) }

        return result
    }

    private suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity> {
        return withContext(Dispatchers.IO) {
            repository.saveAllAndFlush(entities)
        }
    }
}