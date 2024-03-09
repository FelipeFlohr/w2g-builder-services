package dev.felipeflohr.w2gservices.builder.dto

import java.io.Serializable
import java.util.Date

data class VideoReferenceDTO(
    val discordMessageUrl: String,
    val messageContent: String,
    val messageUrlContent: String?,
    val messageCreatedAt: Date,
    val fileStorageHashId: String?,
) : Serializable
