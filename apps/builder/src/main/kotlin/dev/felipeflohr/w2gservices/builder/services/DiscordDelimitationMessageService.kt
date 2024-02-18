package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO

interface DiscordDelimitationMessageService {
    suspend fun saveDelimitationMessage(delimitation: DiscordDelimitationMessageDTO)
}