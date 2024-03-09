package dev.felipeflohr.w2gservices.builder.utils

import java.util.UUID

object UniqueUtils {
    fun generateUuidV4(): String {
        return UUID.randomUUID().toString()
    }
}