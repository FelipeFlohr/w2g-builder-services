package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import java.io.Serializable
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
) : Serializable {
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

    override fun toString(): String {
        return "DiscordMessageAuthorDTO(avatarPngUrl=$avatarPngUrl, bannerPngUrl=$bannerPngUrl, bot=$bot, createdAt=$createdAt, discriminator='$discriminator', displayName='$displayName', globalName=$globalName, id='$id', tag='$tag', system=$system, username='$username')"
    }
}
