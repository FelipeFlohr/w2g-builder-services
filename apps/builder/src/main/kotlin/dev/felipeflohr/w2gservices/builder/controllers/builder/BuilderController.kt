package dev.felipeflohr.w2gservices.builder.controllers.builder

import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderController {
    suspend fun getVideoReferences(guildId: String): List<VideoReferenceDTO>
    suspend fun getAvailableGuilds(): Set<AvailableGuildDTO>
}