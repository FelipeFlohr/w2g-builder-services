package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageServiceImpl @Autowired constructor(
    private val repository: DiscordMessageRepository,
    private val authorService: DiscordMessageAuthorService,
) : DiscordMessageService {
    override suspend fun save(dto: DiscordMessageDTO): DiscordMessageEntity {
        val entity = dto.toEntity()
        val author = authorService.save(entity.author)
        entity.author = author
        return virtualThread { repository.save(entity) }
    }

    override suspend fun upsert(dto: DiscordMessageDTO): DiscordMessageEntity {
        return update(dto) ?: save(dto)
    }

    override suspend fun update(dto: DiscordMessageDTO): DiscordMessageEntity? {
        val id = virtualThread { repository.findIdByMessageId(dto.id) }
        if (id != null) {
            val entity = dto.toEntity()
            val authorId = virtualThread { repository.findAuthorIdById(id) }!!

            entity.author.id = authorId
            val authorEntity = authorService.save(entity.author)
            entity.author = authorEntity
            return virtualThread { repository.save(entity) }
        }
        return null
    }

    override suspend fun delete(dto: DiscordMessageDTO): Boolean {
        val id = virtualThread { repository.findIdByMessageId(dto.id) }
        if (id != null) {
            virtualThread { repository.deleteById(id) }
        }
        return id != null
    }
}