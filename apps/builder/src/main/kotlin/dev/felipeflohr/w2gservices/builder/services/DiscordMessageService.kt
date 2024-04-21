package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import java.util.Date

interface DiscordMessageService {
    suspend fun save(dto: DiscordMessageDTO): DiscordMessageEntity
    suspend fun upsert(dto: DiscordMessageDTO): DiscordMessageEntity
    suspend fun update(dto: DiscordMessageDTO): DiscordMessageEntity?
    suspend fun delete(dto: DiscordMessageDTO): Boolean
    suspend fun getAllByFileReferencesEmptyAndFileLogsEmpty(): List<DiscordMessageEntity>
    suspend fun getAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO>
    suspend fun getDistinctChannelIdsByGuildId(guildId: String): Set<String>
    suspend fun getAllByGuildIdAndChannelIdAndMessageCreatedAtAfter(guildId: String, channelId: String, createdAt: Date): List<DiscordMessageEntity>
}
