package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class AvailableChannelDTO(
    var id: String,
    var name: String,
)
