package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

interface DiscordMessageService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun save(message: DiscordMessageDTO)
    suspend fun delete(message: DiscordMessageDTO)
    suspend fun update(message: DiscordMessageDTO)
    suspend fun getByMessageId(messageId: String): DiscordMessageEntity?
    suspend fun getMessageIdByDiscordMessageId(messageId: String): Long?
    suspend fun getAllWithNoFileReference(): List<DiscordMessageEntity>
    suspend fun getAllDistinctGuildIds(): Set<String>
    suspend fun getAllByMessageIds(messageIds: Collection<String>): List<DiscordMessageEntity>
}
