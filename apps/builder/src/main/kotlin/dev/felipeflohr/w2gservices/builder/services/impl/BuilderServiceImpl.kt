package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.BuilderBusiness
import dev.felipeflohr.w2gservices.builder.business.impl.BuilderBusinessImpl
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.listeners.DiscordMessagesAMQPListener
import dev.felipeflohr.w2gservices.builder.repositories.BuilderRepository
import dev.felipeflohr.w2gservices.builder.services.*
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import jakarta.annotation.PostConstruct
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kotlin.concurrent.thread

@Service
class BuilderServiceImpl @Autowired constructor(
    private val repository: BuilderRepository,
    private val messageService: DiscordMessageService,
    private val messageFileReferenceService: MessageFileReferenceService,
    private val messageFileLogService: MessageFileLogService,
    private val downloaderService: DownloaderService,
    private val amqpListener: DiscordMessagesAMQPListener,
    private val messengerService: MessengerService,
    private val fileStorageService: FileStorageService,
) : BuilderService {
    private val business: BuilderBusiness = BuilderBusinessImpl()
    private val logger = LoggerUtils.getLogger(BuilderServiceImpl::class)

    @PostConstruct
    private fun init() {
        thread {
            runBlocking {
                deleteStaleData()
                downloadReferences()
            }
        }
    }

    override suspend fun getVideoReferences(guildId: String, channelId: String): List<VideoReferenceDTO> {
        val buildMessages = virtualThread { repository.getBuildMessages(guildId, channelId) }
        val references = messageFileReferenceService.getAllByDiscordMessageIds(buildMessages.map { it.id })
        val logs = messageFileLogService.getAllByDiscordMessageIds(buildMessages.map { it.id })

        business.populateVideoReferencesAndLogs(buildMessages, references, logs)
        return business.generateVideoReferencesFromBuildMessages(buildMessages)
    }

    override suspend fun getAvailableGuilds(): Set<AvailableGuildDTO> {
        val guilds = messageService.getAllDistinctGuildIdsAndChannelIds()
        val guildIds = guilds.map { it.guildId }
        return messengerService.getGuildsWithImageLink(guildIds)
    }

    override suspend fun getAvailableChannels(guildId: String): Set<AvailableChannelDTO> {
        val channels = messageService.getDistinctChannelIdsByGuildId(guildId)
        return messengerService.getChannelNames(GuildAndChannelIdsDTO(guildId, channels))
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
        val guilds = messageService.getAllDistinctGuildIdsAndChannelIds()
        guilds.forEach { guild ->
            async {
                res[guild.guildId] = getVideoReferences(guild.guildId, guild.channelId)
            }.await()
        }

        return@coroutineScope res
    }

    private suspend fun downloadReferences() = coroutineScope {
        amqpListener.waitForOngoingMessages()
        val references = getVideoReferencesForEveryGuild()
        references.forEach { reference ->
            async {
                downloadReferencesOfMessagesWithoutReference(reference.value)
            }.await()
        }
    }

    private suspend fun deleteStaleData() {
        return coroutineScope {
            try {
                val hashes = messageFileReferenceService.getAllHashes()
                val staleData = fileStorageService.getStaleData(hashes)
                staleData
                    .filter { !it.exist }
                    .forEach { stale ->
                        async {
                            messageFileReferenceService.deleteByHash(stale.hash)
                            logger.info("Deleted stale data. Hash: ${stale.hash}")
                        }.await()
                    }
            } catch (e: Exception) {
                logger.error("Failed to delete stale data. Process will be ignored.", e)
            }
        }
    }
}