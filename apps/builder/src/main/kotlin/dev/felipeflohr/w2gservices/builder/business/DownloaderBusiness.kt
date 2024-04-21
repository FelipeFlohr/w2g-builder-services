package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.types.Either
import org.springframework.http.ResponseEntity

interface DownloaderBusiness {
    fun getUrlsFromMessages(messages: List<DiscordMessageEntity>): Map<DiscordMessageEntity, Set<String>>
    suspend fun postUrlsToDownload(urls: Set<String>): ResponseEntity<DownloaderVideoBatchResponseDTO>
    fun videoBatchResponseToListOfDownloadedOrFailure(response: DownloaderVideoBatchResponseDTO, urlMap: Map<DiscordMessageEntity, Set<String>>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
}