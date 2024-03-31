package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity

interface DiscordMessageService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun save(message: DiscordMessageDTO)
    suspend fun saveAndFlush(message: DiscordMessageDTO): DiscordMessageEntity
    suspend fun delete(message: DiscordMessageDTO)
    suspend fun update(message: DiscordMessageDTO)
    suspend fun updateAndFlush(message: DiscordMessageDTO): DiscordMessageEntity?
    suspend fun upsert(message: DiscordMessageDTO)
    suspend fun upsertAndFlush(message: DiscordMessageDTO): DiscordMessageEntity
    suspend fun getByMessageId(messageId: String): DiscordMessageEntity?
    suspend fun getMessageIdByDiscordMessageId(messageId: String): Long?
    suspend fun getAllWithNoFileReference(): List<DiscordMessageEntity>
    suspend fun getAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO>
    suspend fun getAllByMessageIds(messageIds: Collection<String>): List<DiscordMessageEntity>
    suspend fun getAuthorIdByMessageId(messageId: String): Long?
    suspend fun getDistinctGuildIds(): Set<String>
    suspend fun getDistinctChannelIdsByGuildId(guildId: String): Set<String>
    suspend fun existsByMessageId(id: String): Boolean
    suspend fun getIdByMessageId(messageId: String): Long?
}
