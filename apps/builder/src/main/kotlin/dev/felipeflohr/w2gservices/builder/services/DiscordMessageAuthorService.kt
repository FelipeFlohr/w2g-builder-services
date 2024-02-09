package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity

interface DiscordMessageAuthorService {
    suspend fun saveAuthor(author: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity
}