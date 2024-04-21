package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg

@NoArg
data class DownloaderVideoBatchResponseDTO(
    var downloaded: List<DownloaderVideoDownloadedDTO>,
    var failed: List<DownloaderFailureDTO>
)
