package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import java.io.Serializable
import java.util.Date

@NoArg
data class DiscordMessageDTO(
    var applicationId: String?,
    var author: DiscordMessageAuthorDTO,
    var cleanContent: String,
    var content: String,
    var createdAt: Date,
    var hasThread: Boolean,
    var id: String,
    var pinnable: Boolean,
    var pinned: Boolean,
    var position: Int?,
    var system: Boolean,
    var url: String,
    var guildId: String,
    var channelId: String,
    var deleted: Boolean,
) : Serializable {
    fun toEntity(authorId: Long): DiscordMessageEntity {
        return DiscordMessageEntity(
            authorId = authorId,
            system = system,
            messageCreatedAt = createdAt.toInstant(),
            messageId = id,
            url = url,
            channelId = channelId,
            pinned = pinned,
            position = position,
            content = content,
            guildId = guildId,
        )
    }
}
