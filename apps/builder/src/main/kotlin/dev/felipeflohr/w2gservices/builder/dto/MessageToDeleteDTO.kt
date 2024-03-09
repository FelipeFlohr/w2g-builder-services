package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class MessageToDeleteDTO(
    var id: Long,
    var messageId: String,
    var authorId: Long,
) : Serializable
