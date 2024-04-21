package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity

interface DiscordDelimitationMessageCustomRepository {
    fun findLastByGuildIdAndChannelId(guildId: String, channelId: String): DiscordDelimitationMessageEntity?
}