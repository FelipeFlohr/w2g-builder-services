package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity

interface DiscordDelimitationMessageService {
    suspend fun upsert(delimitation: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity
    suspend fun getLastByGuildIdAndChannelId(guildId: String, channelId: String): DiscordDelimitationMessageEntity?
}
