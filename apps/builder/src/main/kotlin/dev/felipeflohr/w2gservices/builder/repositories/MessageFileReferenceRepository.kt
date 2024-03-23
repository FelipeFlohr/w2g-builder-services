package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.MessageFileReferenceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface MessageFileReferenceRepository : JpaRepository<MessageFileReferenceEntity, Long> {
    @Query("from MessageFileReferenceEntity mfr where mfr.message.id in (:ids)")
    fun getAllByMessageIdsIn(ids: Collection<Long>): List<MessageFileReferenceEntity>
}
