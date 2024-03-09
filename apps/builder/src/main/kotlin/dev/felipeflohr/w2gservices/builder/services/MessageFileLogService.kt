package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity

interface MessageFileLogService {
    suspend fun saveAllAndFlush(entities: List<MessageFileLogEntity>): List<MessageFileLogEntity>
}