package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordDelimitationMessageServiceImpl @Autowired constructor(
    private val repository: DiscordDelimitationMessageRepository,
    private val messageService: DiscordMessageService,
) : DiscordDelimitationMessageService {
    override suspend fun upsert(delimitation: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity {
        return update(delimitation) ?: save(delimitation)
    }

    suspend fun update(delimitation: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity? {
        val existingEntityId = virtualThread {
            repository.findIdByGuildIdAndChannelId(
                delimitation.message.guildId,
                delimitation.message.channelId
            )
        }
        if (existingEntityId != null) {
            val message = messageService.upsert(delimitation.message)
            val entity = delimitation.toEntity(existingEntityId, message)
            return virtualThread { repository.save(entity) }
        }
        return null
    }

    suspend fun save(delimitation: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity {
        val message = messageService.upsert(delimitation.message)
        val entity = delimitation.toEntity(null, message)
        return virtualThread { repository.save(entity) }
    }
}