package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class DownloaderVideoBatchResponseDTO(
    var downloaded: List<DownloaderVideoDownloadedDTO>,
    var failed: List<DownloaderFailureDTO>
) : Serializable