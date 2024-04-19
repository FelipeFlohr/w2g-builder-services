package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
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
) {
    fun toEntity(): DiscordMessageEntity {
        return DiscordMessageEntity(
            messageCreatedAt = createdAt,
            messageId = id,
            url = url,
            pinned = pinned,
            system = system,
            content = content,
            guildId = guildId,
            position = position,
            channelId = channelId,
            author = author.toEntity(),
            id = null,
            delimitationMessage = null,
            fileLogs = null,
            fileReferences = null,
        )
    }
}
