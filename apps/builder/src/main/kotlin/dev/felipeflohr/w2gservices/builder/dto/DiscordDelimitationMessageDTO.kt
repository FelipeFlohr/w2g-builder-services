package dev.felipeflohr.w2gservices.builder.dto

import java.util.Date

data class DiscordDelimitationMessageDTO(
    val createdAt: Date,
    val message: DiscordMessageDTO,
)
