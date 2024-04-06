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

@Repository
class DiscordDelimitationMessageCustomRepositoryImpl @Autowired constructor (
    context: JpaContext,
    private val messageService: DiscordMessageService
) : DiscordDelimitationMessageCustomRepository {
    private val entityManager = context.getEntityManagerByManagedType(DiscordDelimitationMessageEntity::class.java)

    override fun update(delimitation: DiscordDelimitationMessageDTO) {
        val sql = """
            update DiscordDelimitationMessageEntity
            set delimitationCreatedAt = :createdAt,
            message.id = :id
            where message.messageId = :messageId
        """.trimIndent()
        val message = runBlocking { messageService.upsertAndFlush(delimitation.message) }

        val query = entityManager.createQuery(sql)
        query.setParameter("createdAt", delimitation.createdAt)
        query.setParameter("id", message.id)
        query.setParameter("messageId", message.messageId)
        query.executeUpdate()
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
}