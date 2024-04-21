package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.functions.virtualThreadSupplier
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileLogRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileLogServiceImpl @Autowired constructor(
    private val repository: MessageFileLogRepository,
) : MessageFileLogService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileLogEntity>): List<MessageFileLogEntity> {
        return virtualThreadSupplier { repository.saveAllAndFlush(entities) }
    }
}
