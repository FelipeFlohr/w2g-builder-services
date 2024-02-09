package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import java.util.Date

data class DiscordMessageAuthorDTO(
    val avatarPngUrl: String?,
    val bannerPngUrl: String?,
    val bot: Boolean,
    val createdAt: Date,
    val discriminator: String,
    val displayName: String,
    val globalName: String?,
    val id: String,
    val tag: String,
    val system: Boolean,
    val username: String,
) {
    fun toEntity(): DiscordMessageAuthorEntity {
        return DiscordMessageAuthorEntity(
            system = system,
            authorId = id,
            bot = bot,
            username = username,
            autCreatedAt = createdAt,
            avatarPngUrl = avatarPngUrl,
            bannerPngUrl = bannerPngUrl,
            globalName = globalName,
            displayName = displayName,
            id = null,
            message = null,
        )
    }
}
