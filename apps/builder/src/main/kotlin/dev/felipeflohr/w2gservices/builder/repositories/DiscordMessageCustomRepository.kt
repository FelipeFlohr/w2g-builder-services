package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO

interface DiscordMessageCustomRepository {
    fun findAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO>
}