package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageRepository : JpaRepository<DiscordMessageEntity, Long>, DiscordMessageCustomRepository {
    @Query("select (count(dme) > 0) from DiscordMessageEntity dme where dme.messageId = :messageId")
    fun existsMessageByMessageId(messageId: String): Boolean

    @Transactional
    @Modifying
    @Query("delete from DiscordMessageEntity where messageId = :messageId")
    fun deleteMessageByMessageId(messageId: String)

    @Query("select id from DiscordMessageEntity where messageId = :messageId")
    fun getMessageIdByDiscordMessageId(messageId: String): Long?
}