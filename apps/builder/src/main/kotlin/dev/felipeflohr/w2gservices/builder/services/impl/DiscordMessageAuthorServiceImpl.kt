package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageAuthorServiceImpl(
    @Autowired
    private val authorRepository: DiscordMessageAuthorRepository
) : DiscordMessageAuthorService {
    override suspend fun saveAuthor(author: DiscordMessageAuthorDTO): DiscordMessageAuthorEntity {
        return withContext(Dispatchers.IO) {
            return@withContext authorRepository.saveAndFlush(author.toEntity())
        }
    }
}