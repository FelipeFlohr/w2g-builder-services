package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import java.util.Date

data class DiscordMessageDTO(
    val applicationId: String?,
    val author: DiscordMessageAuthorDTO,
    val cleanContent: String,
    val content: String,
    val createdAt: Date,
    val hasThread: Boolean,
    val id: String,
    val pinnable: Boolean,
    val pinned: Boolean,
    val position: Int?,
    val system: Boolean,
    val url: String,
    val guildId: String,
    val channelId: String,
    val deleted: Boolean,
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
