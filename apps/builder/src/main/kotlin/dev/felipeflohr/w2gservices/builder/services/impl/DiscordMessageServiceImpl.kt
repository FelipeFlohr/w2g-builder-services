package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import dev.felipeflohr.w2gservices.builder.services.DownloaderService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.Collections
import kotlin.collections.ArrayList

@Service
class DiscordMessageServiceImpl @Autowired constructor (
    private val repository: DiscordMessageRepository,
    private val authorService: DiscordMessageAuthorService,
    private val downloaderService: DownloaderService
) : DiscordMessageService {
    private val fetchedGuildIds: MutableList<String> = Collections.synchronizedList(ArrayList())

    override suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (!fetchedGuildIds.contains(message.guildId)) {
                fetchedGuildIds.addLast(message.guildId)
                val messagesToDelete = repository.getMessagesToDeleteByGuildId(message.guildId)
                val messagesDeleted = repository.deleteByIdListReturningAuthorIds(messagesToDelete)
                authorService.deleteAuthorsByIds(messagesDeleted)
            }

            save(message)
        }
    }

    override suspend fun save(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsByMessageId(message.id)) {
                update(message)
            } else {
                val messageFlushed = repository.saveAndFlush(message.toEntity())
                downloaderService.downloadVideosAndSave(listOf(messageFlushed))
            }
        }
    }

    override suspend fun delete(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsByMessageId(message.id)) {
                repository.deleteByMessageId(message.id)
                authorService.deleteAuthorByAuthorId(message.author.id)
            }
        }
    }

    override suspend fun update(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            authorService.updateAuthor(message.author)
            repository.updateMessage(message)
        }
    }

    override suspend fun getByMessageId(messageId: String): DiscordMessageEntity? {
        return withContext(Dispatchers.IO) {
            repository.getByMessageId(messageId)
        }
    }

    override suspend fun getMessageIdByDiscordMessageId(messageId: String): Long? {
        return withContext(Dispatchers.IO) {
            return@withContext repository.getMessageIdByDiscordMessageId(messageId)
        }
    }

    override suspend fun getAllWithNoFileReference(): List<DiscordMessageEntity> {
        return withContext(Dispatchers.IO) {
            repository.getAllByFileReferencesEmptyAndFileLogsEmpty()
        }
    }

    override suspend fun getAllDistinctGuildIds(): Set<String> {
        return withContext(Dispatchers.IO) {
            repository.getAllDistinctGuildIds()
        }
    }

    override suspend fun getAllByMessageIds(messageIds: Collection<String>): List<DiscordMessageEntity> {
        return withContext(Dispatchers.IO) {
            repository.getAllByMessageIdIn(messageIds)
        }
    }
}
