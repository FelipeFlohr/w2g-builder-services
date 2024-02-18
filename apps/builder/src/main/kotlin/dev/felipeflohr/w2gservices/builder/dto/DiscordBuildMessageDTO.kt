package dev.felipeflohr.w2gservices.builder.dto

import java.util.Date

data class DiscordBuildMessageDTO(
    val id: String,
    val channelId: String,
    val guildId: String,
    val content: String,
    val createdAt: Date,
    val authorId: String,
    val authorName: String,
    val authorProfilePngUrl: String,
)
