package dev.felipeflohr.w2gservices.builder.controllers

import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderController {
    suspend fun getVideoReferences(guildId: String): List<VideoReferenceDTO>
}