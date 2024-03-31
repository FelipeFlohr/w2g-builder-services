package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying

interface DiscordDelimitationMessageCustomRepository {
    @Transactional
    @Modifying
    fun update(delimitation: DiscordDelimitationMessageDTO)
    @Transactional
    @Modifying
    fun update(delimitation: DiscordDelimitationMessageEntity)
    @Transactional
    @Modifying
    fun upsert(entity: DiscordDelimitationMessageEntity)
}