package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageAuthorServiceImpl @Autowired constructor(
    private val repository: DiscordMessageAuthorRepository,
) : DiscordMessageAuthorService {
    override suspend fun save(entity: DiscordMessageAuthorEntity): DiscordMessageAuthorEntity {
        return repository.save(entity).awaitSingle()
    }

    override suspend fun save(dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity {
       return save(dto.toEntity())
    }

    override suspend fun update(id: Long, dto: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity {
        val entity = dto.toEntity()
        entity.id = id
        repository.update(id, dto)
        return repository.findById(id).awaitFirst()
    }
}
