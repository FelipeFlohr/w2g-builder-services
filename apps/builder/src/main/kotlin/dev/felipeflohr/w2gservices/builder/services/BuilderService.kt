package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderService {
    suspend fun getVideoReferences(guildId: String): List<VideoReferenceDTO>
    suspend fun getAvailableGuilds(): Set<AvailableGuildDTO>
}