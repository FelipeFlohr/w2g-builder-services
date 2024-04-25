package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.DownloaderBusiness
import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import dev.felipeflohr.w2gservices.builder.types.Either
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DownloaderServiceImpl @Autowired constructor(
    private val business: DownloaderBusiness
) : DownloaderService {
    private val logger = LoggerUtils.getLogger(DownloaderServiceImpl::class)

    override suspend fun downloadVideos(messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val urlMap = business.getUrlsFromMessages(messages)
        val urls = urlMap.values.reduce { acc, curr -> acc + curr }
        if (urlMap.isNotEmpty()) {
            val videos = business.postUrlsToDownload(urls)

            if (videos.body == null || videos.statusCode.isError) {
                val msg = "Not possible to download video. Status: ${videos.statusCode.value()} | Body: ${videos.body}"
                logger.error(msg)
                throw RuntimeException(msg)
            }
            val response = videos.body!!
            return createListOfReferencesOrLogs(urlMap, response)
        }
        return emptyList()
    }

    fun createListOfReferencesOrLogs(urlMap: Map<DiscordMessageEntity, Set<String>>, response: DownloaderVideoBatchResponseDTO): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val res: MutableList<Either<MessageFileReferenceEntity, MessageFileLogEntity>> = ArrayList()
        response.downloaded.forEach { downloaded ->
            val reference = MessageFileReferenceEntity(
                fileHash = downloaded.fileHash,
                url = downloaded.url,
                message = urlMap.entries.find { it.value.contains(downloaded.url) }!!.key
            )
            res.add(Either.Left(reference))
        }
        response.failed.forEach { failed ->
            val log = MessageFileLogEntity(
                body = failed.error,
                message = urlMap.entries.find { it.value.contains(failed.url) }!!.key,
                url = failed.url,
            )
            res.add(Either.Right(log))
        }
        urlMap.entries
            .filter { it.value.isEmpty() }
            .forEach { entry ->
                val log = MessageFileLogEntity(
                    body = "URL not found in message",
                    message = entry.key,
                    url = null
                )
                res.add(Either.Right(log))
            }

        return res
    }
}