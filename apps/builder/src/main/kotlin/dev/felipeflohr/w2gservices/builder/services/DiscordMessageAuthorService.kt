package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO

interface DiscordMessageAuthorService {
    suspend fun deleteByIds(ids: List<Long>)
    suspend fun updateAuthor(author: DiscordMessageAuthorDTO)
    suspend fun deleteById(id: Long)
}