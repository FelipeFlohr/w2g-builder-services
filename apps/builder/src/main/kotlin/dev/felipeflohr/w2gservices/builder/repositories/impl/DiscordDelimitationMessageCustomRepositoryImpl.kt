package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageCustomRepository
import dev.felipeflohr.w2gservices.builder.services.DiscordMessageService
import jakarta.persistence.NoResultException
import jakarta.transaction.Transactional
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.repository.JpaContext
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import java.util.Date

@Repository
class DiscordDelimitationMessageCustomRepositoryImpl @Autowired constructor (
    context: JpaContext,
    private val messageService: DiscordMessageService
) : DiscordDelimitationMessageCustomRepository {
    private val entityManager = context.getEntityManagerByManagedType(DiscordDelimitationMessageEntity::class.java)

    override fun update(delimitation: DiscordDelimitationMessageDTO) {
        val sql = """
            update DiscordDelimitationMessageEntity
            set message.id = :messageId,
            delimitationCreatedAt = :createdAt,
            updatedAt = :updatedAt
            where id = :id
        """.trimIndent()
        val delimitationId = getIdByMessageMessageId(delimitation.message.channelId, delimitation.message.guildId)

        if (delimitationId != null) {
            val message = runBlocking { messageService.upsertAndFlush(delimitation.message) }
            val query = entityManager.createQuery(sql)
            query.setParameter("messageId", message.id)
            query.setParameter("createdAt", delimitation.createdAt)
            query.setParameter("updatedAt", Date())
            query.setParameter("id", delimitationId)
            query.executeUpdate()
        }
    }

    @Transactional
    @Modifying
    override fun update(delimitation: DiscordDelimitationMessageEntity) {
        update(delimitation.toDTO())
    }

    @Transactional
    @Modifying
    override fun upsert(entity: DiscordDelimitationMessageEntity) {
        if (entity.id != null && existsById(entity.id!!)) {
            entityManager.persist(entity)
        } else {
            update(entity)
        }
    }

    private fun existsById(id: Long): Boolean {
        val sql = "select 1 from DiscordDelimitationMessageEntity dme where dme.id = :id"

        val query = entityManager.createQuery(sql)
        query.setParameter("id", id)
        return try {
            query.singleResult != null
        } catch (e: NoResultException) {
            false
        }
    }

    private fun getIdByMessageMessageId(channelId: String, guildId: String): Long? {
        val sql = """
            select ddm.id
            from DiscordDelimitationMessageEntity ddm
            inner join ddm.message dme
            where dme.channelId = :channelId
            and dme.guildId = :guildId
        """.trimIndent()

        val query = entityManager.createQuery(sql, Long::class.java)
        query.setParameter("channelId", channelId)
        query.setParameter("guildId", guildId)
        query.setMaxResults(1)

        return try {
            query.singleResult
        } catch (e: NoResultException) {
            null
        }
    }
}