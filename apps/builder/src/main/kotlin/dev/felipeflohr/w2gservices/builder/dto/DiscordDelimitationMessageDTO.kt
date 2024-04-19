package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import java.util.Date

@NoArg
data class DiscordDelimitationMessageDTO(
    var createdAt: Date,
    var message: DiscordMessageDTO,
) {
    fun toEntity(): DiscordDelimitationMessageEntity {
        return DiscordDelimitationMessageEntity(
            delimitationCreatedAt = createdAt,
            message = message.toEntity()
        )
    }

    fun toEntity(id: Long?, message: DiscordMessageEntity): DiscordDelimitationMessageEntity {
        return DiscordDelimitationMessageEntity(
            id = id,
            delimitationCreatedAt = createdAt,
            message = message
        )
    }
}
