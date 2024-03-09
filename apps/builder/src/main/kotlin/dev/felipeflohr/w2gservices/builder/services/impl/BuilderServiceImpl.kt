package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.repositories.BuilderRepository
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import dev.felipeflohr.w2gservices.builder.utils.URLUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BuilderServiceImpl(
    @Autowired
    private val repository: BuilderRepository
) : BuilderService {
    override fun getVideoReferences(guildId: String): List<VideoReferenceDTO> {
        val res = repository.getBuildMessages(guildId)
        return generateMessages(res)
    }

    private fun generateMessages(messages: Set<DiscordBuildMessageDTO>): List<VideoReferenceDTO> {
        val videos: MutableList<VideoReferenceDTO> = ArrayList()
        messages.forEach { message ->
            val urls = URLUtils.getUrlsFromString(message.content)
            if (urls.isEmpty()) {
                val videoReference = generateVideoReferenceDTO(message, null)
                videos.addLast(videoReference)
            } else {
                urls.forEach { url ->
                    val videoReference = generateVideoReferenceDTO(message, url)
                    videos.addLast(videoReference)
                }
            }
        }

        return videos
    }

    private fun generateVideoReferenceDTO(message: DiscordBuildMessageDTO, url: String?): VideoReferenceDTO {
        return VideoReferenceDTO(
            discordMessageUrl = message.url,
            messageCreatedAt = message.createdAt,
            messageContent = message.content,
            messageUrlContent = url,
            fileStorageHashId = null,
        )
    }
}