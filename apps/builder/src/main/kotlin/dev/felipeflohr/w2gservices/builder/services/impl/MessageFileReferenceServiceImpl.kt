package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileReferenceRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileReferenceServiceImpl @Autowired constructor (
    private val repository: MessageFileReferenceRepository,
) : MessageFileReferenceService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity> {
        return withContext(Dispatchers.IO) {
            repository.saveAllAndFlush(entities)
        }
    }

    override suspend fun getByDiscordMessageIds(ids: Collection<Long>): List<MessageFileReferenceEntity> {
        return withContext(Dispatchers.IO) {
            repository.getAllByIdIn(ids)
        }
    }
}