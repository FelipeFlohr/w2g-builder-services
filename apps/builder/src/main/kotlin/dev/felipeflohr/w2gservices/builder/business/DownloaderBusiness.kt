package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.utils.Either
import org.springframework.http.ResponseEntity

interface DownloaderBusiness {
    fun getUrlsFromMessages(messages: List<DiscordMessageEntity>): Set<String>
    suspend fun postUrlsToDownloader(urls: Set<String>): ResponseEntity<DownloaderVideoBatchResponseDTO>
    fun getReferencesEntitiesFromEitherList(either: List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>): List<MessageFileReferenceEntity>
    fun getLogEntitiesFromEitherList(either: List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>): List<MessageFileLogEntity>
    fun createEntityListFromVideoBatchResponse(res: DownloaderVideoBatchResponseDTO, messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
    fun createEitherListFromEntities(references: List<MessageFileReferenceEntity>, logs: List<MessageFileLogEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
}