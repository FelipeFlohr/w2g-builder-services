package dev.felipeflohr.w2gservices.builder.configurations

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import java.time.Duration

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
        return builder
            .baseUrl(envProperty)
            .clientConnector(ReactorClientHttpConnector(createHttpClient()))
            .build()
    }

    private fun createHttpClient(): HttpClient {
        return HttpClient.create()
            .responseTimeout(Duration.ofMinutes(15))
    }
}