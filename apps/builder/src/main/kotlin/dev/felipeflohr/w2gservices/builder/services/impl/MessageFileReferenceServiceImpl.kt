package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThread
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileReferenceRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileReferenceServiceImpl @Autowired constructor (
    private val repository: MessageFileReferenceRepository,
) : MessageFileReferenceService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity> = virtualThread {
        repository.saveAllAndFlush(entities)
    }

    override suspend fun getAllByDiscordMessageIds(ids: Collection<Long>): List<MessageFileReferenceEntity> = virtualThread {
        repository.getAllByMessageIdsIn(ids)
    }

    override suspend fun getAllHashes(): Set<String> = virtualThread {
        val hashes = repository.getAllHashes()
        hashes.toSet()
    }

    override suspend fun deleteByHash(hash: String) = virtualThread {
        repository.deleteByFileHash(hash)
    }
}
