package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageAuthorEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageAuthorRepository : JpaRepository<DiscordMessageAuthorEntity, Long>, DiscordMessageAuthorCustomRepository {
    @Transactional
    @Modifying
    @Query("""
        delete from DiscordMessageAuthorEntity
        where id in (:ids)
    """)
    fun deleteAuthorsByIds(ids: List<Long>)

    @Transactional
    @Modifying
    @Query("delete DiscordMessageAuthorEntity where authorId = :authorId")
    fun deleteAuthorByAuthorId(authorId: String)
}