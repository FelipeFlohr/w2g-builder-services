package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class DiscordMessageServiceImpl(
    @Autowired
    private val repository: DiscordMessageRepository,

    @Autowired
    private val authorService: DiscordMessageAuthorService
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

            saveMessage(message)
        }
    }

    override suspend fun saveMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsByMessageId(message.id)) {
                updateMessage(message)
            } else {
                repository.save(message.toEntity())
            }
        }
    }

    override suspend fun deleteMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsByMessageId(message.id)) {
                repository.deleteByMessageId(message.id)
                authorService.deleteAuthorByAuthorId(message.author.id)
            }
        }
    }

    override suspend fun updateMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            authorService.updateAuthor(message.author)
            repository.updateMessage(message)
        }
    }

    override suspend fun getMessageByMessageId(messageId: String): DiscordMessageEntity? {
        return withContext(Dispatchers.IO) {
            repository.getByMessageId(messageId)
        }
    }

    override suspend fun getMessageIdByDiscordMessageId(messageId: String): Long? {
        return withContext(Dispatchers.IO) {
            return@withContext repository.getMessageIdByDiscordMessageId(messageId)
        }
    }

    override suspend fun getAllMessagesWithNoFileReference(): List<DiscordMessageEntity> {
        return withContext(Dispatchers.IO) {
            repository.getAllByFileReferencesEmptyAndFileLogsEmpty()
        }
    }
}
