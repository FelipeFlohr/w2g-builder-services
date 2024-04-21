package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.business.BuilderBusiness
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.listeners.DiscordMessagesAMQPListener
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.FileStorageService
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import dev.felipeflohr.w2gservices.builder.services.MessengerService
import dev.felipeflohr.w2gservices.builder.services.ReferenceDownloadService
import dev.felipeflohr.w2gservices.builder.utils.LoggerUtils
import jakarta.annotation.PostConstruct
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kotlin.concurrent.thread

@Service
class BuilderServiceImpl @Autowired constructor(
    private val business: BuilderBusiness,
    private val messageService: DiscordMessageService,
    private val delimitationService: DiscordDelimitationMessageService,
    private val messageFileReferenceService: MessageFileReferenceService,
    private val fileStorageService: FileStorageService,
    private val referenceDownloadService: ReferenceDownloadService,
    private val messengerService: MessengerService,
) : BuilderService {
    private val logger = LoggerUtils.getLogger(BuilderServiceImpl::class)

    @PostConstruct
    private fun onInit() {
        thread {
            runBlocking {
                deleteStaleData()
                downloadReferences()
            }
        }
    }

    override suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        messageService.upsert(message)
    }

    override suspend fun delimitationMessage(delimitation: DiscordDelimitationMessageDTO) {
        delimitationService.upsert(delimitation)
    }

    override suspend fun createdMessage(message: DiscordMessageDTO) {
        messageService.save(message)
    }

    override suspend fun updatedMessage(message: DiscordMessageDTO) {
        val result = messageService.update(message)
        logEntityNotFoundMessage(message, "update", result == null)
    }

    override suspend fun deletedMessage(message: DiscordMessageDTO) {
        val messageWasDeleted = messageService.delete(message)
        logEntityNotFoundMessage(message, "delete", !messageWasDeleted)
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

    override suspend fun getVideoReferences(guildId: String, channelId: String): List<VideoReferenceDTO> {
        val delimitationMessage = delimitationService.getLastByGuildIdAndChannelId(guildId, channelId)
        if (delimitationMessage != null) {
            val messages = messageService.getAllByGuildIdAndChannelIdAndMessageCreatedAtAfter(guildId, channelId, delimitationMessage.message.messageCreatedAt)
            return business.getReferencesFromMessages(delimitationMessage, messages)
        }
        return emptyList()
    }

    private fun logEntityNotFoundMessage(message: DiscordMessageDTO, operation: String, log: Boolean) {
        if (log) {
            logger.warn(
                "The following message was received in the \"$operation\" listener, however, no entity was " +
                        "found to perform such action: $message"
            )
        }
    }

    private suspend fun deleteStaleData() {
        try {
            val hashes = messageFileReferenceService.findAllHashes()
            if (hashes.isNotEmpty()) {
                val staleData = fileStorageService.getStaleData(hashes)
                val staleHashes = staleData
                    .filter { !it.exist }
                    .map { it.hash }
                messageFileReferenceService.deleteManyByHashIn(staleHashes)
            }
        } catch (e: Exception) {
            logger.error("Failed to delete stale data. Process will be ignored.", e)
        }
    }

    private suspend fun downloadReferences() {
        DiscordMessagesAMQPListener.waitForOngoingMessages()
        val messagesWithoutReferencesAndLogs = messageService.getAllByFileReferencesEmptyAndFileLogsEmpty()
        referenceDownloadService.downloadAndSaveReferenceForEntitiesInBackground(messagesWithoutReferencesAndLogs)
    }
}