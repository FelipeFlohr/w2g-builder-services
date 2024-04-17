package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

interface DiscordMessageService {
    suspend fun save(dto: DiscordMessageDTO): DiscordMessageEntity
    suspend fun upsert(dto: DiscordMessageDTO): DiscordMessageEntity
    suspend fun update(dto: DiscordMessageDTO): DiscordMessageEntity?
    suspend fun delete(dto: DiscordMessageDTO): DiscordMessageEntity?
}