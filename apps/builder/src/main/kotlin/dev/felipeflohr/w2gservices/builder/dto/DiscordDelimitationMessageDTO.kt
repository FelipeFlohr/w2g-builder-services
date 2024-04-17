package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import java.io.Serializable
import java.util.Date

@NoArg
data class DiscordDelimitationMessageDTO(
    var createdAt: Date,
    var message: DiscordMessageDTO,
) : Serializable {
    fun toEntity(messageId: Long): DiscordDelimitationMessageEntity {
        return DiscordDelimitationMessageEntity(
            messageId = messageId,
            delimitationCreatedAt = createdAt.toInstant()
        )
    }
}
