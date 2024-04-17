package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordDelimitationMessageService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordDelimitationMessageServiceImpl @Autowired constructor(
    private val discordMessageService: DiscordMessageService,
    private val repository: DiscordDelimitationMessageRepository,
) : DiscordDelimitationMessageService {
    override suspend fun save(dto: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity {
        val message = discordMessageService.upsert(dto.message)
        val existingDelimitationId = findIdByGuildIdAndChannelId(dto.message.guildId, dto.message.channelId)

        val entity = dto.toEntity(message.id!!)
        if (existingDelimitationId != null) {
            entity.id = existingDelimitationId
        }
        return entity
    }

    override suspend fun findIdByGuildIdAndChannelId(guildId: String, channelId: String): Long? {
        return repository.findIdByGuildIdAndChannelId(guildId, channelId).awaitSingleOrNull()
    }
}
