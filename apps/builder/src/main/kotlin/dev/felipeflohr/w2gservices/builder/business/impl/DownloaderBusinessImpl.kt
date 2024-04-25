package dev.felipeflohr.w2gservices.builder.business.impl

import dev.felipeflohr.w2gservices.builder.annotations.Business
import dev.felipeflohr.w2gservices.builder.business.DownloaderBusiness
import dev.felipeflohr.w2gservices.builder.configurations.WebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DownloaderFailureDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoDownloadedDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.types.DownloaderApplicationAddressesType
import dev.felipeflohr.w2gservices.builder.types.Either
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import dev.felipeflohr.w2gservices.builder.utils.URLUtils
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient

@Business
class DownloaderBusinessImpl @Autowired constructor(
    @Qualifier(WebClientConfiguration.DOWNLOADER_WEB_CLIENT_BEAN_NAME) private val webClient: WebClient
) : DownloaderBusiness {
    private val logger = LoggerUtils.getLogger(DownloaderBusinessImpl::class)

    override fun getUrlsFromMessages(messages: List<DiscordMessageEntity>): Map<DiscordMessageEntity, Set<String>> {
        val map = mutableMapOf<DiscordMessageEntity, Set<String>>()
        messages.forEach { map[it] = URLUtils.getUrlsFromString(it.content) }
        return map
    }

    override suspend fun postUrlsToDownload(urls: Set<String>): ResponseEntity<DownloaderVideoBatchResponseDTO> {
        return webClient
            .post()
            .uri(DownloaderApplicationAddressesType.DOWNLOAD_VIDEO.address)
            .body(BodyInserters.fromValue(urls))
            .retrieve()
            .toEntity(DownloaderVideoBatchResponseDTO::class.java)
            .awaitFirst()
    }

    override fun videoBatchResponseToListOfDownloadedOrFailure(
        response: DownloaderVideoBatchResponseDTO,
        urlMap: Map<DiscordMessageEntity, Set<String>>
    ): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val references = videoDownloadedListToFileReferenceList(response.downloaded, urlMap)
        val logs = videoFailureListToFileLogList(response.failed, urlMap)
        return createListOfEitherReferenceOrLog(references, logs)
    }

    private fun createListOfEitherReferenceOrLog(
        references: List<MessageFileReferenceEntity>,
        logs: List<MessageFileLogEntity>
    ): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val list: MutableList<Either<MessageFileReferenceEntity, MessageFileLogEntity>> = ArrayList()
        references.forEach { list.add(Either.Left(it)) }
        logs.forEach { list.add(Either.Right(it)) }
        return list
    }

    private fun videoDownloadedListToFileReferenceList(
        videoDownloadedList: List<DownloaderVideoDownloadedDTO>,
        urlMap: Map<DiscordMessageEntity, Set<String>>
    ): List<MessageFileReferenceEntity> {
        return videoDownloadedList
            .map { videoDownloaded ->
                val entity = urlMap
                    .entries
                    .find { it.value.contains(videoDownloaded.url) }!!
                    .key
                MessageFileReferenceEntity(
                    fileHash = videoDownloaded.fileHash,
                    message = entity,
                    url = videoDownloaded.url,
                )
            }
    }

    private fun videoFailureListToFileLogList(
        videoFailureList: List<DownloaderFailureDTO>,
        urlMap: Map<DiscordMessageEntity, Set<String>>
    ): List<MessageFileLogEntity> {
        return videoFailureList
            .map { videoFailure ->
                val entity = urlMap
                    .entries
                    .find { it.value.contains(videoFailure.url) }!!
                    .key
                MessageFileLogEntity(
                    message = entity,
                    body = videoFailure.error,
                    url = videoFailure.url,
                )
            }
    }
}
