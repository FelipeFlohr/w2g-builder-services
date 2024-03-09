package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.DownloaderBusiness
import dev.felipeflohr.w2gservices.builder.business.impl.DownloaderBusinessImpl
import dev.felipeflohr.w2gservices.builder.configurations.DownloaderWebClientConfiguration
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import dev.felipeflohr.w2gservices.builder.utils.Either
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class DownloaderServiceImpl @Autowired constructor(
    @Qualifier(DownloaderWebClientConfiguration.DOWNLOADER_WEB_CLIENT_BEAN_NAME)
    private val downloaderWebClient: WebClient,
    private val messageFileReferenceService: MessageFileReferenceService,
    private val messageFileLogService: MessageFileLogService
) : DownloaderService {
    private val logger = LoggerUtils.getLogger(DownloaderServiceImpl::class)
    private val business: DownloaderBusiness = DownloaderBusinessImpl(downloaderWebClient)

    override suspend fun downloadVideosAndSave(messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>  {
        val videos = downloadVideos(messages)
        val entities = business.createEntityListFromVideoBatchResponse(videos, messages)

        val savedReferences = messageFileReferenceService.saveAllAndFlush(business.getReferencesEntitiesFromEitherList(entities))
        val savedLogs = messageFileLogService.saveAllAndFlush(business.getLogEntitiesFromEitherList(entities))
        return business.createEitherListFromEntities(savedReferences, savedLogs)
    }

    override suspend fun downloadVideos(messages: List<DiscordMessageEntity>): DownloaderVideoBatchResponseDTO {
        val urls = business.getUrlsFromMessages(messages)
        val video = business.postUrlsToDownloader(urls)

        if (video.body == null || video.statusCode.isError) {
            val msg = "Not possible to download video. Status: ${video.statusCode.value()} | Body: ${video.body}"
            logger.error(msg)
            throw RuntimeException(msg)
        }
        return video.body!!
    }
}