package dev.felipeflohr.w2gservices.builder.dto

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import java.io.Serializable

@NoArg
data class DownloaderFailureDTO(
    var url: String,
    var error: String
) : Serializable {
    override fun toString(): String {
        return "DownloaderFailureDTO(url='$url', error='$error')"
    }
}
