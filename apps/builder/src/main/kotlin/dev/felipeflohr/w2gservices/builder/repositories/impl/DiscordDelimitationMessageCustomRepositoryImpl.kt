package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordDelimitationMessageCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.NoResultException
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository

@Repository
class DiscordDelimitationMessageCustomRepositoryImpl(
    @PersistenceContext private val entityManager: EntityManager
) : DiscordDelimitationMessageCustomRepository {
    override fun findLastByGuildIdAndChannelId(guildId: String, channelId: String): DiscordDelimitationMessageEntity? {
        val sql = """
            from DiscordDelimitationMessageEntity ddm
            inner join fetch ddm.message dme
            where dme.guildId = :guildId
            and dme.channelId = :channelId
            order by ddm.delimitationCreatedAt desc
        """.trimIndent()

        val query = entityManager.createQuery(sql, DiscordDelimitationMessageEntity::class.java)
        query.setParameter("guildId", guildId)
        query.setParameter("channelId", channelId)
        query.maxResults = 1
        return try {
            query.singleResult
        } catch (e: NoResultException) {
            null
        }
    }
}