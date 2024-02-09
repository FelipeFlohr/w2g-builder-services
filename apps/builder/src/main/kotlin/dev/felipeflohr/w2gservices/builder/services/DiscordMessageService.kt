package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO

interface DiscordMessageService {
    suspend fun saveMessage(message: DiscordMessageDTO)
}
