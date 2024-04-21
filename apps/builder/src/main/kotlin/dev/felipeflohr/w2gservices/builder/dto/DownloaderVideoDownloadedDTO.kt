package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class DownloaderVideoDownloadedDTO(
    var url: String,
    var fileHash: String,
    var filename: String,
    var mimeType: String,
)
