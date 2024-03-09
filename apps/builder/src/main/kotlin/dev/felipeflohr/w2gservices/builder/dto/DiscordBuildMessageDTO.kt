package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable
import java.util.Date

@NoArg
data class DiscordBuildMessageDTO(
    var id: Long,
    var messageId: String,
    var channelId: String,
    var guildId: String,
    var content: String,
    var createdAt: Date,
    var authorId: String,
    var authorName: String,
    var authorProfilePngUrl: String,
    var url: String,
    var references: List<MessageFileReferenceDTO> = ArrayList(),
    var logs: List<MessageFileLogDTO> = ArrayList()
) : Serializable {
    constructor(
        id: Long,
        messageId: String,
        channelId: String,
        guildId: String,
        content: String,
        createdAt: Date,
        authorId: String,
        authorName: String,
        authorProfilePngUrl: String,
        url: String
    ) : this(
        id = id,
        messageId = messageId,
        channelId = channelId,
        guildId = guildId,
        content = content,
        createdAt = createdAt,
        authorId = authorId,
        authorName = authorName,
        authorProfilePngUrl = authorProfilePngUrl,
        url = url,
        references = ArrayList(),
        logs = ArrayList()
    )
}
