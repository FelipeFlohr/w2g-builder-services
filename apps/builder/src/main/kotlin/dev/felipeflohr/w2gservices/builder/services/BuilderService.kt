package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO

interface BuilderService {
    suspend fun bootstrapMessage(message: DiscordMessageDTO)
    suspend fun delimitationMessage(delimitation: DiscordDelimitationMessageDTO)
    suspend fun createdMessage(message: DiscordMessageDTO)
    suspend fun updatedMessage(message: DiscordMessageDTO)
    suspend fun deletedMessage(message: DiscordMessageDTO)
    suspend fun getAvailableGuilds(): Set<AvailableGuildDTO>
    suspend fun getAvailableChannels(guildId: String): Set<AvailableChannelDTO>
    suspend fun getVideoReferences(guildId: String, channelId: String): List<VideoReferenceDTO>
}
