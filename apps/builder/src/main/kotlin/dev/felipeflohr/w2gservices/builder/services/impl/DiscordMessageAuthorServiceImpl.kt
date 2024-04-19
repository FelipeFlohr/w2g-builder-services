package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageAuthorServiceImpl @Autowired constructor(
    private val repository: DiscordMessageAuthorRepository,
) : DiscordMessageAuthorService {
    override suspend fun save(entity: DiscordMessageAuthorEntity): DiscordMessageAuthorEntity {
        return virtualThread { repository.save(entity) }
    }

    override suspend fun save(dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity {
        return save(dto.toEntity())
    }

    override suspend fun upsert(id: Long?, dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity {
        if (id != null) {
            return virtualThread { repository.save(dto.toEntity(id)) }
        }
        return virtualThread { repository.save(dto.toEntity()) }
    }

    override suspend fun update(id: Long, dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity? {
        return save(dto.toEntity(id))
    }

    override suspend fun deleteById(id: Long) {
        virtualThread { repository.deleteById(id) }
    }
}
