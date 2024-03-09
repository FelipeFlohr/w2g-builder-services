package dev.felipeflohr.w2gservices.builder.configurations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class FileStorageWebClientConfiguration(
    @Autowired
    private val env: Environment
) {
    companion object {
        const val FILE_STORAGE_WEB_CLIENT_BEAN_NAME = "fileStorageWebClient"
    }

    @Bean(name = [FILE_STORAGE_WEB_CLIENT_BEAN_NAME])
    fun fileStorageWebClient(builder: WebClient.Builder): WebClient {
        val envProperty = env.getProperty("builder.file-storage.address") ?: throw IllegalArgumentException()
        return builder.baseUrl(envProperty).build()
    }
}