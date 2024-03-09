package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordDelimitationMessageServiceImpl(
    @Autowired
    private val messageService: DiscordMessageService,

    @Autowired
    private val repository: DiscordDelimitationMessageRepository,
) : DiscordDelimitationMessageService {
    override suspend fun saveDelimitationMessage(delimitation: DiscordDelimitationMessageDTO) {
        val persistedMessage = messageService.getMessageByMessageId(delimitation.message.id)
        if (persistedMessage != null) {
            withContext(Dispatchers.IO) {
                repository.deleteByMessageId(persistedMessage.id as Long)
            }
        }
        val entity = if (persistedMessage != null) {
            DiscordDelimitationMessageEntity(
                id = null,
                message = persistedMessage,
                delimitationCreatedAt = delimitation.createdAt
            )
        } else {
            DiscordDelimitationMessageEntity.toEntity(delimitation)
        }

        withContext(Dispatchers.IO) {
            repository.save(entity)
        }
    }
}