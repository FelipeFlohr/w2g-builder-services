package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.BuilderBusiness
import dev.felipeflohr.w2gservices.builder.business.impl.BuilderBusinessImpl
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.BuilderRepository
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import jakarta.annotation.PostConstruct
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BuilderServiceImpl @Autowired constructor (
    private val repository: BuilderRepository,
    private val messageService: DiscordMessageService,
    private val messageFileReferenceService: MessageFileReferenceService,
    private val messageFileLogService: MessageFileLogService,
    private val downloaderService: DownloaderService
) : BuilderService {
    private val business: BuilderBusiness = BuilderBusinessImpl()

    @PostConstruct
    private fun init() {
        runBlocking {
            val references = getVideoReferencesForEveryGuild()
            references.forEach { reference ->
                async {
                    downloadReferencesOfMessagesWithoutReference(reference.value)
                }.await()
            }
        }
    }

    override suspend fun getVideoReferences(guildId: String): List<VideoReferenceDTO> {
        val buildMessages = withContext(Dispatchers.IO) { repository.getBuildMessages(guildId) }
        val references = messageFileReferenceService.getByDiscordMessageIds(buildMessages.map { it.id })
        val logs = messageFileLogService.getByDiscordMessageIds(buildMessages.map { it.id })

        business.populateVideoReferencesAndLogs(buildMessages, references, logs)
        return business.generateVideoReferencesFromBuildMessages(buildMessages)
    }

    private suspend fun downloadReferencesOfMessagesWithoutReference(references: List<VideoReferenceDTO>) {
        val entities = getEntitiesFromVideoReferences(references)
        downloaderService.downloadVideosAndSave(entities)
    }

    private suspend fun getEntitiesFromVideoReferences(references: List<VideoReferenceDTO>): List<DiscordMessageEntity> {
        val ids = references.map { it.discordMessageId }
        return messageService.getAllByMessageIds(ids)
    }

    private suspend fun getVideoReferencesForEveryGuild(): Map<String, List<VideoReferenceDTO>> = coroutineScope {
        val res: MutableMap<String, List<VideoReferenceDTO>> = HashMap()
        val guilds = messageService.getAllDistinctGuildIds()
        guilds.forEach { guild ->
            async {
                res[guild] = getVideoReferences(guild)
            }.await()
        }

        return@coroutineScope res
    }
}