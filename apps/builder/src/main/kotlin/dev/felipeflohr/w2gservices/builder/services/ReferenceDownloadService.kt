package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.types.Either
import java.util.concurrent.CompletableFuture

interface ReferenceDownloadService {
    suspend fun downloadAndSaveReferenceForEntity(entity: DiscordMessageEntity): Either<MessageFileReferenceEntity, MessageFileLogEntity>?
    suspend fun downloadAndSaveReferenceForEntities(entities: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>
    fun downloadAndSaveReferenceForEntityInBackground(entity: DiscordMessageEntity): CompletableFuture<Either<MessageFileReferenceEntity, MessageFileLogEntity>?>
    fun downloadAndSaveReferenceForEntitiesInBackground(entities: List<DiscordMessageEntity>): CompletableFuture<List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>>
}
