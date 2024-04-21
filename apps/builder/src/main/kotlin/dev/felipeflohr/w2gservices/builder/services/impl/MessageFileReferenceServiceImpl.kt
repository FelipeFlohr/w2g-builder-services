package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThreadSupplier
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileReferenceRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileReferenceService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileReferenceServiceImpl @Autowired constructor(
    private val repository: MessageFileReferenceRepository
) : MessageFileReferenceService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity> {
        return virtualThreadSupplier { repository.saveAllAndFlush(entities) }
    }

    override suspend fun findAllHashes(): Set<String> {
        return virtualThreadSupplier { repository.findAllHashes() }.toSet()
    }

    override suspend fun deleteManyByHashIn(hashes: List<String>) {
        virtualThreadSupplier { repository.deleteByFileHashIn(hashes) }
    }
}