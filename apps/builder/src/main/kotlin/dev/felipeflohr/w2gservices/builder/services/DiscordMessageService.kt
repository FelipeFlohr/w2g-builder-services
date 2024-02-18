package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

interface DiscordMessageService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun saveMessage(message: DiscordMessageDTO)
    suspend fun deleteMessage(message: DiscordMessageDTO)
    suspend fun updateMessage(message: DiscordMessageDTO)
    suspend fun getMessageByMessageId(messageId: String): DiscordMessageEntity?
    suspend fun getMessageIdByDiscordMessageId(messageId: String): Long?
}
