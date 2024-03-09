package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.utils.Either

interface MessageFileReferenceService {
    suspend fun downloadAndSaveDiscordMessages(messages: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
}