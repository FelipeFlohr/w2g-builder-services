package dev.felipeflohr.w2gservices.builder.business

import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelIdsDTO
import org.springframework.http.ResponseEntity

interface MessengerBusiness {
    suspend fun getGuildsWithImageLink(guildIds: Collection<String>): ResponseEntity<List<AvailableGuildDTO>>
    suspend fun getChannelNames(channels: GuildAndChannelIdsDTO): ResponseEntity<List<AvailableChannelDTO>>
}