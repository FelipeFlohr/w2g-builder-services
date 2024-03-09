package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class DownloaderVideoBatchResponseDTO(
    val downloaded: List<DownloaderVideoDownloadedDTO>,
    val failure: List<DownloaderFailureDTO>
) : Serializable {
    override fun toString(): String {
        return "DownloaderVideoBatchResponseDTO(downloaded=$downloaded, failure=$failure)"
    }
}
