package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO

interface DiscordMessageAuthorService {
    /**
     * Deletes all the authors related to a guild
     * by the guild's ID.
     */
    suspend fun deleteByIds(ids: List<Long>)
    suspend fun updateAuthor(author: DiscordMessageAuthorDTO)
    suspend fun deleteByAuthorId(authorId: String)
}