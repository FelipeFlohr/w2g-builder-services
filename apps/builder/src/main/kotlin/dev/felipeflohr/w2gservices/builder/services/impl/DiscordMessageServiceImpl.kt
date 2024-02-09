package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageAuthorService
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DiscordMessageServiceImpl(
    @Autowired
    private val authorService: DiscordMessageAuthorService,

    @Autowired
    private val repository: DiscordMessageRepository,
) : DiscordMessageService {
    override suspend fun saveMessage(message: DiscordMessageDTO) {
        withContext(Dispatchers.IO) {
            val author = authorService.saveAuthor(message.author)

            val messageEntity = message.toEntity()
            messageEntity.author = author
            repository.save(messageEntity)
        }
    }
}
