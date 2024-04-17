package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO

interface DiscordMessageAuthorCustomRepository {
    suspend fun update(id: Long, dto: DiscordMessageAuthorDTO): Long
}
