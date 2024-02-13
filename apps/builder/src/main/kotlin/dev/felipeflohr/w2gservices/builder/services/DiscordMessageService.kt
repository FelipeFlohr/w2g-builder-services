package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO

interface DiscordMessageService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun saveMessage(message: DiscordMessageDTO)
    suspend fun deleteMessage(message: DiscordMessageDTO)
    suspend fun updateMessage(message: DiscordMessageDTO)
    suspend fun getMessageIdByDiscordMessageId(messageId: String): Long?
}
