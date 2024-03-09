package dev.felipeflohr.w2gservices.builder.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.nio.charset.StandardCharsets

object StreamUtils {
    private const val TEMP_FILE_SUFFIX = ".tmp"

    @JvmStatic
    @Throws(IOException::class)
    suspend fun streamToString(stream: InputStream): String {
        val result = ByteArrayOutputStream()
        val buffer = ByteArray(1024)
        var length: Int
        while ((withContext(Dispatchers.IO) {
                stream.read(buffer)
            }.also { length = it }) != -1) {
            result.write(buffer, 0, length)
        }

        return result.toString(StandardCharsets.UTF_8)
    }

    @JvmStatic
    @Throws(IOException::class)
    suspend fun streamToFile(inputStream: InputStream): File {
        return withContext(Dispatchers.IO) {
            val tempFile = File.createTempFile(UniqueUtils.generateUuidV4(), TEMP_FILE_SUFFIX)
            tempFile.deleteOnExit()

            inputStream.use { stream ->
                FileOutputStream(tempFile).use { outputStream ->
                    val buffer = ByteArray(1024)
                    var length: Int
                    while ((stream.read(buffer).also { length = it }) != -1) {
                        outputStream.write(buffer, 0, length)
                    }
                }
            }

            return@withContext tempFile
        }
    }
}
