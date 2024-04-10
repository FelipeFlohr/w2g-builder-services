package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity

interface MessageFileReferenceService {
    suspend fun saveAllAndFlush(entities: List<MessageFileReferenceEntity>): List<MessageFileReferenceEntity>
    suspend fun getAllByDiscordMessageIds(ids: Collection<Long>): List<MessageFileReferenceEntity>
    suspend fun getAllHashes(): Set<String>
    suspend fun deleteByHash(hash: String)
}
