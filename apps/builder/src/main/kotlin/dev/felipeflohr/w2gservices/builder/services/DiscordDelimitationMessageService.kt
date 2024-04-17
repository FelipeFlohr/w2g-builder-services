package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity

interface DiscordDelimitationMessageService {
    suspend fun save(dto: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity
    suspend fun findIdByGuildIdAndChannelId(guildId: String, channelId: String): Long?
}
