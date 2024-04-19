package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageRepository : CrudRepository<DiscordMessageEntity, Long> {
    @Query("select dme.id from DiscordMessageEntity dme where dme.messageId = :messageId")
    fun findIdByMessageId(messageId: String): Long?

    @Query("select dme.author.id from DiscordMessageEntity dme where dme.id = :id")
    fun findAuthorIdById(id: Long): Long
}
