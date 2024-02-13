package dev.felipeflohr.w2gservices.builder.services

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO

interface DiscordMessageAuthorService {
    /**
     * Deletes all the authors related to a guild
     * by the guild's ID.
     */
    suspend fun deleteAuthorsByIds(ids: List<Long>)
    suspend fun updateAuthor(author: DiscordMessageAuthorDTO)
    suspend fun deleteAuthorByAuthorId(authorId: String)
}