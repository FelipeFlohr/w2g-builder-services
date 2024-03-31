package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable
import java.util.Date

@NoArg
data class DiscordDelimitationMessageDTO(
    var createdAt: Date,
    var message: DiscordMessageDTO,
) : Serializable {
    override fun toString(): String {
        return "DiscordDelimitationMessageDTO(createdAt=$createdAt, message=$message)"
    }
}
