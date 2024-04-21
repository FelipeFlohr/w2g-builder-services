package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class DownloaderFailureDTO(
    var url: String,
    var error: String,
)
