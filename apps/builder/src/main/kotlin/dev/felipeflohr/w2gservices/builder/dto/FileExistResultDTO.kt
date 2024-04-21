package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class FileExistResultDTO(
    var hash: String,
    var exist: Boolean,
)
