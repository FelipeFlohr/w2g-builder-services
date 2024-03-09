package dev.felipeflohr.w2gservices.builder.utils

import java.net.MalformedURLException
import java.net.URI
import java.net.URISyntaxException
import java.util.regex.Pattern

object URLUtils {
    private val URL_PATTERN: Pattern = Pattern.compile(
        "(?:^|\\W)((ht|f)tp(s?)://|www\\.)"
                + "(([\\w\\-]+\\.)+([\\w\\-.~]+/?)*"
                + "[\\p{Alnum}.,%_=?&#\\-+()\\[\\]*$~@!:/{};']*)",
        Pattern.CASE_INSENSITIVE or Pattern.MULTILINE or Pattern.DOTALL
    )

    fun getUrlsFromString(str: String): Set<String> {
        val result: MutableSet<String> = HashSet();
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
