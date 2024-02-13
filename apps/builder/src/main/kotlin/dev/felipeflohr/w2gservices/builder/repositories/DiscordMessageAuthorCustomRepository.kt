package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageAuthorDTO
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying

interface DiscordMessageAuthorCustomRepository {
    @Transactional
    @Modifying
    fun updateAuthor(author: DiscordMessageAuthorDTO): Int
}