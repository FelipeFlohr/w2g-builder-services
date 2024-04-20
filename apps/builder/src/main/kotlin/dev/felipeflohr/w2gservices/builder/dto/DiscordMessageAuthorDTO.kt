package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import java.util.Date

@NoArg
data class DiscordMessageAuthorDTO(
    var avatarPngUrl: String?,
    var bannerPngUrl: String?,
    var bot: Boolean,
    var createdAt: Date,
    var discriminator: String,
    var displayName: String,
    var globalName: String?,
    var id: String,
    var tag: String,
    var system: Boolean,
    var username: String,
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

    fun toEntity(id: Long): DiscordMessageAuthorEntity {
        val entity = toEntity()
        entity.id = id
        return entity
    }
}
