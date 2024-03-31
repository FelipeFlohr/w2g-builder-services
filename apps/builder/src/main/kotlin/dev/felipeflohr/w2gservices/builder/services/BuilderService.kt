package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderService {
    suspend fun getVideoReferences(guildId: String, channelId: String): List<VideoReferenceDTO>
    suspend fun getAvailableGuilds(): Set<AvailableGuildDTO>
    suspend fun getAvailableChannels(guildId: String): Set<AvailableChannelDTO>
}