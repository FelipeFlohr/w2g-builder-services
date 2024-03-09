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

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DiscordMessageDTO

        if (content != other.content) return false
        if (id != other.id) return false

        return true
    }

    override fun hashCode(): Int {
        var result = content.hashCode()
        result = 31 * result + id.hashCode()
        return result
    }
}
