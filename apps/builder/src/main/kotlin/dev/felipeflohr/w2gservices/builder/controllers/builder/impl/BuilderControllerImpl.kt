package dev.felipeflohr.w2gservices.builder.controllers.builder.impl

import dev.felipeflohr.w2gservices.builder.controllers.builder.BuilderController
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
class BuilderControllerImpl @Autowired constructor (
    private val service: BuilderService
) : BuilderController {
    @GetMapping("/references/{guildId}")
    override suspend fun getVideoReferences(@PathVariable guildId: String): List<VideoReferenceDTO> {
        return service.getVideoReferences(guildId)
    }

    @GetMapping("/guilds")
    override suspend fun getAvailableGuilds(): Set<AvailableGuildDTO> {
        return service.getAvailableGuilds()
    }
}