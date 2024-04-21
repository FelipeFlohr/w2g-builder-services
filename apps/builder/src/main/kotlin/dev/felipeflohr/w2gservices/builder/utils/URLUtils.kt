package dev.felipeflohr.w2gservices.builder.utils

import java.net.MalformedURLException
import java.net.URI
import java.net.URISyntaxException

object URLUtils {
    fun getUrlsFromString(str: String): Set<String> {
        val result: MutableSet<String> = HashSet()
        val splitString = str.split(' ')

        for (split in splitString) {
            try {
                URI(split).toURL()
                result.add(split)
            }
            catch (ignore: URISyntaxException) {}
            catch (ignore: MalformedURLException) {}
            catch (ignore: IllegalArgumentException) {}
        }

        return result
    }
}