package dev.felipeflohr.w2gservices.builder.controllers.builder.impl

import dev.felipeflohr.w2gservices.builder.controllers.builder.BuilderController
import dev.felipeflohr.w2gservices.builder.dto.AvailableChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.AvailableGuildDTO
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("builder")
class BuildControllerImpl @Autowired constructor(
    private val service: BuilderService
) : BuilderController {
    @GetMapping("/references/{guildId}/{channelId}")
    override suspend fun getVideoReferences(@PathVariable guildId: String, @PathVariable channelId: String): List<VideoReferenceDTO> {
        return service.getVideoReferences(guildId, channelId)
    }

    @GetMapping("/guilds")
    override suspend fun getAvailableGuilds(): Set<AvailableGuildDTO> {
        return service.getAvailableGuilds()
    }

    @GetMapping("/channels/{guildId}")
    override suspend fun getAvailableChannels(@PathVariable guildId: String): Set<AvailableChannelDTO> {
        return service.getAvailableChannels(guildId)
    }
}
