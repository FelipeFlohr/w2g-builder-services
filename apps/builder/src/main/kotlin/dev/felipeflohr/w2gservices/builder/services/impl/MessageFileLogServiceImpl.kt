package dev.felipeflohr.w2gservices.builder.services.impl

import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import dev.felipeflohr.w2gservices.builder.repositories.MessageFileLogRepository
import dev.felipeflohr.w2gservices.builder.services.MessageFileLogService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MessageFileLogServiceImpl @Autowired constructor(
    private val repository: MessageFileLogRepository
) : MessageFileLogService {
    override suspend fun saveAllAndFlush(entities: List<MessageFileLogEntity>): List<MessageFileLogEntity> {
        return withContext(Dispatchers.IO) {
            repository.saveAllAndFlush(entities)
        }
    }

    override suspend fun getByDiscordMessageIds(ids: Collection<Long>): List<MessageFileLogEntity> {
        return withContext(Dispatchers.IO) {
            repository.getAllByIdIn(ids)
        }
    }
}
