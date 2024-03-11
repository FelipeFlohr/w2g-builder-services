package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import jakarta.transaction.Transactional
import kotlinx.coroutines.coroutineScope
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Service

@Service
class DiscordDelimitationMessageServiceImpl(
    @Autowired
    private val messageService: DiscordMessageService,

    @Autowired
    private val repository: DiscordDelimitationMessageRepository,
) : DiscordDelimitationMessageService {
    @Modifying
    @Transactional
    override suspend fun saveDelimitationMessage(delimitation: DiscordDelimitationMessageDTO): Unit = coroutineScope {
        val persistedMessage = messageService.getByMessageId(delimitation.message.id)
        if (persistedMessage != null) {
            repository.deleteByMessageId(persistedMessage.id as Long)
        }
        val entity = if (persistedMessage != null) {
            DiscordDelimitationMessageEntity(
                id = null,
                message = persistedMessage,
                delimitationCreatedAt = delimitation.createdAt
            )
        } else {
            val messageSaved = messageService.saveAndFlush(delimitation.message)
            val entityDetached = DiscordDelimitationMessageEntity.toEntity(delimitation)
            entityDetached.message = messageSaved
            entityDetached
        }

        repository.save(entity)
    }
}