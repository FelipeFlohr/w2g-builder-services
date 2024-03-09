package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import java.io.Serializable

@NoArg
data class MessageFileReferenceDTO(
    var id: Long,
    var messageId: Long,
    var url: String,
    var fileHash: String,
) : Serializable {
    companion object {
        @JvmStatic
        fun fromEntity(entity: MessageFileReferenceEntity): MessageFileReferenceDTO {
            return MessageFileReferenceDTO(
                id = entity.id!!,
                messageId = entity.message.id!!,
                fileHash = entity.fileHash,
                url = entity.url,
            )
        }
    }
}
