package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DownloaderVideoBatchResponseDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.utils.Either

interface DownloaderService {
    suspend fun downloadVideosAndSave(messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
    suspend fun downloadVideos(messages: List<DiscordMessageEntity>): DownloaderVideoBatchResponseDTO
}