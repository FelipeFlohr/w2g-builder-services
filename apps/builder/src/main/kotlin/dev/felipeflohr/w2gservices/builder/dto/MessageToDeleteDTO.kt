package dev.felipeflohr.w2gservices.builder.dto

import java.io.Serializable

data class MessageToDeleteDTO(
    var id: Long,
    var messageId: String,
    var authorId: Long,
) : Serializable
