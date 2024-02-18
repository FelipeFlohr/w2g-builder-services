package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.VideoReferenceDTO
import dev.felipeflohr.w2gservices.builder.repositories.BuilderRepository
import dev.felipeflohr.w2gservices.builder.services.BuilderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BuilderServiceImpl(
    @Autowired
    private val repository: BuilderRepository
) : BuilderService {
    override fun getVideoReferences(guildId: String): List<VideoReferenceDTO> {
        val res = repository.getBuildMessages(guildId)
        return ArrayList()
    }
}