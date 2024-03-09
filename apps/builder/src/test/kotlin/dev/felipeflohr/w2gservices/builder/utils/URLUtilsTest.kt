package dev.felipeflohr.w2gservices.builder.utils

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

class URLUtilsTest {
    @Test
    fun getUrlsFromString() {
        val urls = "https://www.google.com/ https://www.google.com/ www.google.com"
        assertEquals(URLUtils.getUrlsFromString(urls).size, 2)
    }
}