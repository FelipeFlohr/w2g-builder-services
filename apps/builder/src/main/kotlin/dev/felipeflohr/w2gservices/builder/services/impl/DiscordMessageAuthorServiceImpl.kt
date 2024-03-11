package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageAuthorRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageAuthorServiceImpl(
    @Autowired
    private val repository: DiscordMessageAuthorRepository
) : DiscordMessageAuthorService {
    override suspend fun deleteByIds(ids: List<Long>) = coroutineScope {
        repository.deleteByIds(ids)
    }

    override suspend fun updateAuthor(author: DiscordMessageAuthorDTO) {
        withContext(Dispatchers.IO) {
            repository.update(author)
        }
    }

    override suspend fun deleteByAuthorId(authorId: String) {
        withContext(Dispatchers.IO) {
            repository.deleteByAuthorId(authorId)
        }
    }
}