package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import java.io.Serializable

@NoArg
data class MessageFileLogDTO(
    var id: Long,
    var messageId: Long,
    var body: String,
) : Serializable {
    companion object {
        @JvmStatic
        fun fromEntity(entity: MessageFileLogEntity): MessageFileLogDTO {
            return MessageFileLogDTO(
                id = entity.id!!,
                messageId = entity.message.id!!,
                body = entity.body,
            )
        }
    }
}
