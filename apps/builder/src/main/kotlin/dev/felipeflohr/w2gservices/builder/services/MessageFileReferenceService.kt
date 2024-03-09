package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity

interface MessageFileReferenceService {
    suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity>
    suspend fun getByDiscordMessageIds(ids: Collection<Long>): List<MessageFileReferenceEntity>
}