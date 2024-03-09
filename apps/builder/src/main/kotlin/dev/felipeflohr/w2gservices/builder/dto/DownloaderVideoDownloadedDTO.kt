package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class DownloaderVideoDownloadedDTO(
    var url: String,
    var fileHash: String,
    var filename: String,
    var mimeType: String,
) : Serializable {
    override fun toString(): String {
        return "DownloaderVideoDownloadedDTO(url='$url', fileHash='$fileHash', filename='$filename', mimeType='$mimeType')"
    }
}