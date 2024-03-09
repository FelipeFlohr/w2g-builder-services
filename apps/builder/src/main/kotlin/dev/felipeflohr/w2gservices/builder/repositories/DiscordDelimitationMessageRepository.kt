package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface DiscordDelimitationMessageRepository : JpaRepository<DiscordDelimitationMessageEntity, Long> {
    @Transactional
    @Modifying
    @Query("delete from DiscordDelimitationMessageEntity ddm where ddm.message.id = :messageId")
    fun deleteByMessageId(messageId: Long)
}