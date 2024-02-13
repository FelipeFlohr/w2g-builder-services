package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.Collections

@Service
class DiscordMessageServiceImpl(
    @Autowired
    private val repository: DiscordMessageRepository,

    @Autowired
    private val authorService: DiscordMessageAuthorService
) : DiscordMessageService {
    private val fetchedGuildIds: List<String> = Collections.synchronizedList(ArrayList())

    override suspend fun bootstrapMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (!fetchedGuildIds.contains(message.guildId)) {
                fetchedGuildIds.addLast(message.guildId)
                val messagesDeleted = repository.deleteMessagesByGuildIdReturningAuthorIds(message.guildId)
                authorService.deleteAuthorsByIds(messagesDeleted)
            }

            saveMessage(message)
        }
    }

    override suspend fun saveMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsMessageByMessageId(message.id)) {
                updateMessage(message)
            } else {
                repository.save(message.toEntity())
            }
        }
    }

    override suspend fun deleteMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            if (repository.existsMessageByMessageId(message.id)) {
                repository.deleteMessageByMessageId(message.id)
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

    override suspend fun getMessageIdByDiscordMessageId(messageId: String): Long? {
        return withContext(Dispatchers.IO) {
            return@withContext repository.getMessageIdByDiscordMessageId(messageId)
        }
    }
}
