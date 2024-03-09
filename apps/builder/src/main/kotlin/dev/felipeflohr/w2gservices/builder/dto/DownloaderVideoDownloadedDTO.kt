package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class DownloaderVideoDownloadedDTO(
    val url: String,
    val fileHash: String,
    val filename: String,
    val mimeType: String,
) : Serializable {
    override fun toString(): String {
        return "DownloaderVideoDownloadedDTO(url='$url', fileHash='$fileHash', filename='$filename', mimeType='$mimeType')"
    }
}