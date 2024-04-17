package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageServiceImpl @Autowired constructor(
    private val repository: DiscordMessageRepository,
    private val authorService: DiscordMessageAuthorService,
) : DiscordMessageService {
    override suspend fun save(dto: DiscordMessageDTO): DiscordMessageEntity {
        val author = authorService.save(dto.author)
        val entity = dto.toEntity(author.id!!)
        return repository.save(entity).awaitFirst()
    }

    override suspend fun upsert(dto: DiscordMessageDTO): DiscordMessageEntity {
        return update(dto) ?: save(dto)
    }

    override suspend fun update(dto: DiscordMessageDTO): DiscordMessageEntity? {
        val existingAuthorId = repository.findAuthorIdByMessageId(dto.id).awaitFirstOrNull()
        if (existingAuthorId != null) {
            val author = authorService.update(existingAuthorId, dto.author)
            val entity = dto.toEntity(author.id!!)
            return repository.save(entity).awaitFirst()
        }
        return null
    }

    override suspend fun delete(dto: DiscordMessageDTO): DiscordMessageEntity? {
        val existingEntity = repository.findByMessageId(dto.id).awaitFirstOrNull()
        if (existingEntity != null) {
            repository.delete(existingEntity).awaitFirstOrNull()
        }
        return existingEntity
    }
}
