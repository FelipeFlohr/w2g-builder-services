package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO

interface MessengerService {
    suspend fun getGuildsWithImageLink(guildIds: Collection<String>): Set<AvailableGuildDTO>
    suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): Set<AvailableChannelDTO>
}
