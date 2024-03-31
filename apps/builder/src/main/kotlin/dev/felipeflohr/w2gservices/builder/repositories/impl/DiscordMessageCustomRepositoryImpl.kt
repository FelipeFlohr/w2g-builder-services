package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.dto.MessageToDeleteDTO
import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import java.util.Date

@Repository
class DiscordMessageCustomRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : DiscordMessageCustomRepository {
    override fun update(message: DiscordMessageDTO): Int {
        val querySql = """
            update DiscordMessageEntity
            set content = :content,
            messageCreatedAt = :createdAt,
            pinned = :pinned,
            position = :position,
            system = :system,
            url = :url,
            updatedAt = :currentDate,
            version = version + 1
            where messageId = :id
        """.trimIndent()

        val query = entityManager.createQuery(querySql)
        query.setParameter("content", message.content)
        query.setParameter("createdAt", message.createdAt)
        query.setParameter("pinned", message.pinned)
        query.setParameter("position", message.position)
        query.setParameter("system", message.system)
        query.setParameter("url", message.url)
        query.setParameter("currentDate", Date())
        query.setParameter("id", message.id)

        return query.executeUpdate()
    }

    @Transactional
    @Modifying
    override fun updateAndFlush(message: DiscordMessageDTO): DiscordMessageEntity {
        update(message)
        return getByMessageId(message.id)
    }

    override fun getMessagesToDeleteByGuildId(guildId: String): List<MessageToDeleteDTO> {
        val sql = """
            select new ${MessageToDeleteDTO::class.java.name}(
                dme.id as id, 
                dme.messageId as messageId,
                dme.author.id as authorId)
            from DiscordMessageEntity dme
            where dme.guildId = :guildId
        """.trimIndent()

        val query = entityManager.createQuery(sql, MessageToDeleteDTO::class.java)
        query.setParameter("guildId", guildId)
        return query.resultList
    }

    override fun getAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO> {
        val sql = """
            select distinct new ${GuildAndChannelDTO::class.java.name}(dme.guildId as guildId, dme.channelId as channelId)
            from DiscordDelimitationMessageEntity ddm
            inner join ddm.message dme
        """.trimIndent()

        val query = entityManager.createQuery(sql, GuildAndChannelDTO::class.java)
        return query.resultList.toSet()
    }

    private fun getByMessageId(messageId: String): DiscordMessageEntity {
        val sql = "from DiscordMessageEntity dme where dme.messageId = :messageId"

        val query = entityManager.createQuery(sql, DiscordMessageEntity::class.java)
        query.setParameter("messageId", messageId)
        query.setMaxResults(1)
        return query.singleResult
    }
}