package dev.felipeflohr.w2gservices.builder.dto

data class MessageToDeleteDTO(
    var id: Long,
    var messageId: String,
    var authorId: Long,
)
