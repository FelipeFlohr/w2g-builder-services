package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
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
    override suspend fun saveDelimitationMessage(message: DiscordMessageDTO) {
        val persistedMessage = messageService.getMessageIdByDiscordMessageId(message.id)
        val messageEntity: DiscordMessageEntity

        if (persistedMessage != null) {
            withContext(Dispatchers.IO) {
                repository.deleteDelimitationMessageByMessageId(persistedMessage)
            }
            messageEntity = message.toEntity()
            messageEntity.id = persistedMessage
        } else {
            messageEntity = message.toEntity()
        }

        val entity = DiscordDelimitationMessageEntity(message = messageEntity)
        withContext(Dispatchers.IO) {
            repository.save(entity)
        }
    }
}