package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import dev.felipeflohr.w2gservices.builder.services.ReferenceDownloadService
import dev.felipeflohr.w2gservices.builder.types.Either
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Executors
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReferenceDownloadServiceImpl @Autowired constructor(
    private val downloaderService: DownloaderService,
    private val messageFileReferenceService: MessageFileReferenceService,
    private val messageFileLogService: MessageFileLogService,
) : ReferenceDownloadService {
    override suspend fun downloadAndSaveReferenceForEntity(entity: DiscordMessageEntity): Either<MessageFileReferenceEntity, MessageFileLogEntity>? {
        if (entity.fileReferences.isNullOrEmpty() && entity.fileLogs.isNullOrEmpty()) {
            val references = downloadAndSaveReferenceForEntities(listOf(entity))
            return references.firstOrNull()
        }
        return null
    }

    override suspend fun downloadAndSaveReferenceForEntities(entities: List<DiscordMessageEntity>): List<Either<MessageFileReferenceEntity, MessageFileLogEntity>> {
        val entitiesWithoutReferenceAndLog = entities
            .filter { it.fileReferences.isNullOrEmpty() && it.fileLogs.isNullOrEmpty() }
        if (entitiesWithoutReferenceAndLog.isNotEmpty()) {
            val videos = downloaderService.downloadVideos(entities)
            val references = videos.filterIsInstance<Either.Left<MessageFileReferenceEntity>>().map { it.value }
            val logs = videos.filterIsInstance<Either.Right<MessageFileLogEntity>>().map { it.value }

            val persistedReferences = messageFileReferenceService.saveAllAndFlush(references).map { Either.Left(it) }
            val persistedLogs = messageFileLogService.saveAllAndFlush(logs).map { Either.Right(it) }
            return listOf(persistedReferences, persistedLogs).flatten()
        }
        return emptyList()
    }

    override fun downloadAndSaveReferenceForEntityInBackground(entity: DiscordMessageEntity): CompletableFuture<Either<MessageFileReferenceEntity, MessageFileLogEntity>?> {
        return CompletableFuture.supplyAsync({
            runBlocking {
                downloadAndSaveReferenceForEntity(entity)
            }
        }, Executors.newVirtualThreadPerTaskExecutor())
    }

    override fun downloadAndSaveReferenceForEntitiesInBackground(entities: List<DiscordMessageEntity>): CompletableFuture<List<Either<MessageFileReferenceEntity, MessageFileLogEntity>>> {
        return CompletableFuture.supplyAsync({
            runBlocking {
                downloadAndSaveReferenceForEntities(entities)
            }
        }, Executors.newVirtualThreadPerTaskExecutor())
    }
}
