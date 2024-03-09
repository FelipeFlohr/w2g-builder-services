package dev.felipeflohr.w2gservices.builder.configurations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class DownloaderWebClientConfiguration(
    @Autowired
    private val env: Environment
) {
    companion object {
        const val DOWNLOADER_WEB_CLIENT_BEAN_NAME = "downloaderWebClient"
    }

    @Bean(name = [DOWNLOADER_WEB_CLIENT_BEAN_NAME])
    fun downloaderWebClient(builder: WebClient.Builder): WebClient {
        val envProperty = env.getProperty("builder.downloader.address") ?: throw IllegalArgumentException()
        return builder.baseUrl(envProperty).build()
    }
}