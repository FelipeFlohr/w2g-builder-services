package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileReferenceRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import kotlinx.coroutines.coroutineScope
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileReferenceServiceImpl @Autowired constructor (
    private val repository: MessageFileReferenceRepository,
) : MessageFileReferenceService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity> = coroutineScope {
        repository.saveAllAndFlush(entities)
    }

    override suspend fun getAllByDiscordMessageIds(ids: Collection<Long>): List<MessageFileReferenceEntity> = coroutineScope {
        return@coroutineScope repository.getAllByDiscordMessageIdIn(ids)
    }
}