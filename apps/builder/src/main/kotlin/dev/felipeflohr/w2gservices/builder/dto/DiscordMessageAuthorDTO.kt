package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import java.io.Serializable
import java.util.Date

@NoArg
data class DiscordMessageAuthorDTO(
    var avatarPngUrl: String?,
    var bannerPngUrl: String?,
    var bot: Boolean? = false,
    var createdAt: Date,
    var discriminator: String,
    var displayName: String,
    var globalName: String?,
    var id: String,
    var tag: String,
    var system: Boolean,
    var username: String,
) : Serializable {
    fun toEntity(): DiscordMessageAuthorEntity {
        return DiscordMessageAuthorEntity(
            authorId = id,
            autCreatedAt = createdAt.toInstant(),
            avatarPngUrl = avatarPngUrl,
            bot = bot ?: false,
            bannerPngUrl = bannerPngUrl,
            globalName = globalName,
            displayName = displayName,
            system = system,
            username = username,
        )
    }
}
