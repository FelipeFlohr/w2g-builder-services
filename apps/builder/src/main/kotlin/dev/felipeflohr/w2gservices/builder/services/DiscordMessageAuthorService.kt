package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity

interface DiscordMessageAuthorService {
    suspend fun save(entity: DiscordMessageAuthorEntity): DiscordMessageAuthorEntity
    suspend fun save(dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity
    suspend fun upsert(id: Long?, dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity
    suspend fun update(id: Long, dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity?
    suspend fun deleteById(id: Long)
}
