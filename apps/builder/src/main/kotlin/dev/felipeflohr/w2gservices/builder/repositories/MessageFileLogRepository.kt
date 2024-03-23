package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.MessageFileLogEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MessageFileLogRepository : JpaRepository<MessageFileLogEntity, Long> {
    @Query("from MessageFileLogEntity mfl where mfl.message.id in (:ids)")
    fun getAllByDiscordMessageIdIn(ids: Collection<Long>): List<MessageFileLogEntity>
}
