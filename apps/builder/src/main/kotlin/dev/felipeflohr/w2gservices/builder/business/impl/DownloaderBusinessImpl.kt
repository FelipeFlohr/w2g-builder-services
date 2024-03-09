package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.business.DownloaderBusiness
import dev.felipeflohr.w2gservices.builder.dto.DownloaderFailureDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoDownloadedDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.types.DownloaderApplicationAddressesType
import dev.felipeflohr.w2gservices.builder.utils.Either
import dev.felipeflohr.w2gservices.builder.utils.URLUtils
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

class DownloaderBusinessImpl(
    private val downloaderWebClient: WebClient
) : DownloaderBusiness {
    override fun getUrlsFromMessages(messages: List<DiscordMessageEntity>): Set<String> {
        return messages
            .map { video -> video.content }
            .map { content -> URLUtils.getUrlsFromString(content) }
            .reduce { acc, curr -> acc + curr }
    }

    override suspend fun postUrlsToDownloader(urls: Set<String>): ResponseEntity<DownloaderVideoBatchResponseDTO> {
        return downloaderWebClient
            .post()
            .uri(DownloaderApplicationAddressesType.DOWNLOAD_VIDEO.address)
            .body(BodyInserters.fromValue(urls))
            .retrieve()
            .toEntity(DownloaderVideoBatchResponseDTO::class.java)
            .awaitFirst()
    }

    override fun getReferencesEntitiesFromEitherList(either: List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>): List<MessageFileReferenceEntity> {
        return either
            .filterIsInstance(Either.Left::class.java)
            .map { eitherVal -> eitherVal.value as MessageFileReferenceEntity }
    }

    override fun getLogEntitiesFromEitherList(either: List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>): List<MessageFileLogEntity> {
        return either
            .filterIsInstance(Either.Right::class.java)
            .map { eitherVal -> eitherVal.value as MessageFileLogEntity }
    }

    override fun createEntityListFromVideoBatchResponse(
        res: DownloaderVideoBatchResponseDTO,
        messages: List<DiscordMessageEntity>
    ): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val downloadedVideos = createMapOfDownloadedVideoAndMessageEntity(res, messages)
        val failedVideos = createMapOfFailedDownloadsAndMessageEntity(res, messages)

        val references = downloadedVideos
            .map { entry -> createMessageFileReferenceEntity(entry.key, entry.value) }
        val logs = failedVideos
            .map { entry -> createMessageFileLogEntity(entry.key, entry.value) }
        return createEitherListFromEntities(references, logs)
    }

    override fun createEitherListFromEntities(
        references: List<MessageFileReferenceEntity>,
        logs: List<MessageFileLogEntity>
    ): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val result: MutableList<Either<MessageFileReferenceEntity, MessageFileLogEntity>> = ArrayList()
        references
            .forEach { either -> result.addLast(Either.Left(either)) }
        logs
            .forEach { either -> result.addLast(Either.Right(either)) }

        return result
    }

    private fun createMapOfDownloadedVideoAndMessageEntity(
        res: DownloaderVideoBatchResponseDTO,
        messages: List<DiscordMessageEntity>
    ): Map<DownloaderVideoDownloadedDTO, DiscordMessageEntity> {
        val responseMap: MutableMap<DownloaderVideoDownloadedDTO, DiscordMessageEntity> = HashMap()
        res.downloaded.forEach { downloaded ->
            val messageEntity = findMessageEntityContainingUrl(messages, downloaded.url)
            if (messageEntity != null) {
                responseMap[downloaded] = messageEntity
            }
        }

        return responseMap
    }

    private fun createMapOfFailedDownloadsAndMessageEntity(
        res: DownloaderVideoBatchResponseDTO,
        messages: List<DiscordMessageEntity>
    ): Map<DownloaderFailureDTO, DiscordMessageEntity> {
        val responseMap: MutableMap<DownloaderFailureDTO, DiscordMessageEntity> = HashMap()
        res.failure.forEach { failure ->
            val messageEntity = findMessageEntityContainingUrl(messages, failure.url)
            if (messageEntity != null) {
                responseMap[failure] = messageEntity
            }
        }

        return responseMap
    }

    private fun findMessageEntityContainingUrl(
        messages: List<DiscordMessageEntity>,
        url: String
    ): DiscordMessageEntity? {
        return messages.find { message ->
            val urls = URLUtils.getUrlsFromString(message.content)
            return@find urls
                .any { urlFromMessage -> urlFromMessage.equals(url, true) }
        }
    }

    private fun createMessageFileReferenceEntity(
        videoDownloadedDTO: DownloaderVideoDownloadedDTO,
        message: DiscordMessageEntity
    ): MessageFileReferenceEntity {
        return MessageFileReferenceEntity(
            id = null,
            message = message,
            fileHash = videoDownloadedDTO.fileHash,
            url = videoDownloadedDTO.url,
        )
    }

    private fun createMessageFileLogEntity(
        videoFailureDTO: DownloaderFailureDTO,
        message: DiscordMessageEntity
    ): MessageFileLogEntity {
        return MessageFileLogEntity(
            body = videoFailureDTO.error,
            message = message,
        )
    }
}