package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO

interface DiscordDelimitationMessageService {
    suspend fun saveDelimitationMessage(message: DiscordMessageDTO)
}