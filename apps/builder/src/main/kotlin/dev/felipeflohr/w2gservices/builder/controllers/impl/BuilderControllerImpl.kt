package dev.felipeflohr.w2gservices.builder.controllers.impl

import dev.felipeflohr.w2gservices.builder.controllers.BuilderController
import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("builder")
class BuilderControllerImpl(
    @Autowired
    private val service: BuilderService
) : BuilderController {
    @GetMapping("/{guildId}")
    override suspend fun getVideoReferences(@PathVariable guildId: String): List<VideoReferenceDTO> {
        return service.getVideoReferences(guildId)
    }
}