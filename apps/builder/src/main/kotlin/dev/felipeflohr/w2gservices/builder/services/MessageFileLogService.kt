package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying

interface MessageFileLogService {
    @Modifying
    @Transactional
    suspend fun saveAllAndFlush(entities: List<MessageFileLogEntity>): List<MessageFileLogEntity>
    suspend fun getAllByDiscordMessageIds(ids: Collection<Long>): List<MessageFileLogEntity>
}