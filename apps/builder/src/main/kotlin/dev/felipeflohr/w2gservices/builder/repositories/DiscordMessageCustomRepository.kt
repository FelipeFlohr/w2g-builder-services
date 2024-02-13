package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying

interface DiscordMessageCustomRepository {
    @Transactional
    @Modifying
    fun updateMessage(message: DiscordMessageDTO): Int

    @Transactional
    @Modifying
    fun deleteMessagesByGuildIdReturningAuthorIds(guildId: String): List<Long>
}