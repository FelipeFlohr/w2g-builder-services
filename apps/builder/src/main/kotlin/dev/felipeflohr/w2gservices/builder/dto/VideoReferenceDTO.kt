package dev.felipeflohr.w2gservices.builder.dto

import java.util.Date

data class VideoReferenceDTO(
    val socialMediaUrl: String,
    val messageCreatedAt: Date,
    val mediaUrl: String,
)
