package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderService {
    fun getVideoReferences(guildId: String): List<VideoReferenceDTO>
}