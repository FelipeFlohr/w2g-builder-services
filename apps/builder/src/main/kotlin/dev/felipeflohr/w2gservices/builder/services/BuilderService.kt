package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO

interface BuilderService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun delimitationMessage(delimitation: DiscordDelimitationMessageDTO)
    suspend fun createdMessage(message: DiscordMessageDTO)
    suspend fun updatedMessage(message: DiscordMessageDTO)
    suspend fun deletedMessage(message: DiscordMessageDTO)
}
