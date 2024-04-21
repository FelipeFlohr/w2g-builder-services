package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class AvailableGuildDTO(
    var name: String,
    var guildId: String,
    var url: String?,
)
