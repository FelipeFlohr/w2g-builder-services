package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.util.Date

@NoArg
data class VideoReferenceDTO(
    var discordMessageId: String,
    var discordMessageUrl: String,
    var messageContent: String,
    var messageUrlContent: String?,
    var messageCreatedAt: Date,
    var fileStorageHashId: String?,
    var logBody: String?
)
