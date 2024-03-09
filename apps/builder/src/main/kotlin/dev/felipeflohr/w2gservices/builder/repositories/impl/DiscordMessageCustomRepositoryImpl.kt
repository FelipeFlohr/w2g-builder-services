package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordMessageDTO
import dev.felipeflohr.w2gservices.builder.dto.MessageToDeleteDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import java.util.Date

@Repository
class DiscordMessageCustomRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : DiscordMessageCustomRepository {
    override fun updateMessage(message: DiscordMessageDTO): Int {
        val querySql = """
            update DiscordMessageEntity
            set content = :content,
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
        query.setParameter("pinned", message.pinned)
        query.setParameter("position", message.position)
        query.setParameter("system", message.system)
        query.setParameter("url", message.url)
        query.setParameter("currentDate", Date())
        query.setParameter("id", message.id)

        return query.executeUpdate()
    }

    override fun deleteByIdListReturningAuthorIds(messagesToDelete: List<MessageToDeleteDTO>): List<Long> {
        val messagesToDeleteIds = messagesToDelete.map { message -> message.messageId }
        val authorsToDeleteIds = messagesToDelete.map { message -> message.authorId }
        val deleteQuerySql = """
            delete from DiscordMessageEntity
            where id in (:messagesToDelete)
        """.trimIndent()

        val query = entityManager.createQuery(deleteQuerySql)
        query.setParameter("messagesToDelete", messagesToDeleteIds)
        query.executeUpdate()

        return authorsToDeleteIds
    }

    override fun getMessagesToDeleteByGuildId(guildId: String): List<MessageToDeleteDTO> {
        val messagesToDeleteSql = """
            select new ${MessageToDeleteDTO::class.java.name}(
                dme.id as id, 
                dme.messageId as messageId,
                dme.author.id as authorId)
            from DiscordMessageEntity dme
            where dme.guildId = :guildId
        """.trimIndent()

        val query = entityManager.createQuery(messagesToDeleteSql, MessageToDeleteDTO::class.java)
        query.setParameter("guildId", guildId)
        return query.resultList
    }
}