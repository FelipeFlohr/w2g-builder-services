package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO
import dev.felipeflohr.w2gservices.builder.repositories.BuilderCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.NoResultException
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository

@Repository
class BuilderCustomRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : BuilderCustomRepository {
    override fun getBuildMessages(guildId: String, channelId: String): Set<DiscordBuildMessageDTO> {
        val set: MutableSet<DiscordBuildMessageDTO> = HashSet()
        val delimitationMessage = getDelimitationMessageByGuildIdAndChannelId(guildId, channelId)
        if (delimitationMessage != null) {
            val messagesAfterDelimitation = getDelimitationMessagesByGuildIdAndChannelIdAfterDelimitationMessage(delimitationMessage)
            set.add(delimitationMessage)
            set.addAll(messagesAfterDelimitation)
        }

        return set
    }

    private fun getDelimitationMessagesByGuildIdAndChannelIdAfterDelimitationMessage(delimitation: DiscordBuildMessageDTO): List<DiscordBuildMessageDTO> {
        val sql = """
            select new ${DiscordBuildMessageDTO::class.java.name}(
                dme.id as id,
                dme.messageId as messageId,
                dme.channelId as channelId,
                dme.guildId as guildId,
                dme.content as content,
                dme.messageCreatedAt as createdAt,
                dma.authorId as authorId,
                dma.username as authorName,
                dma.avatarPngUrl as authorProfilePngUrl,
                dme.url as url
            )
            from DiscordMessageEntity dme
            inner join dme.author dma
            where dme.guildId = :guildId
            and dme.channelId = :channelId
            and dme.messageCreatedAt >= :createdAt
            and dme.messageId <> :delimitationMessageId
            order by dme.messageCreatedAt asc
        """.trimIndent()

        val query = entityManager.createQuery(sql, DiscordBuildMessageDTO::class.java)
        query.setParameter("guildId", delimitation.guildId)
        query.setParameter("channelId", delimitation.channelId)
        query.setParameter("createdAt", delimitation.createdAt)
        query.setParameter("delimitationMessageId", delimitation.messageId)
        return try {
            query.resultList
        } catch (e: NoResultException) {
            emptyList()
        }
    }

    private fun getDelimitationMessageByGuildIdAndChannelId(guildId: String, channelId: String): DiscordBuildMessageDTO? {
        val sql = """
            select new ${DiscordBuildMessageDTO::class.java.name}(
                dme.id as id,
                dme.messageId as messageId,
                dme.channelId as channelId,
                dme.guildId as guildId,
                dme.content as content,
                dme.messageCreatedAt as createdAt,
                dma.authorId as authorId,
                dma.username as authorName,
                dma.avatarPngUrl as authorProfilePngUrl,
                dme.url as url
            )
            from DiscordDelimitationMessageEntity ddm
            inner join ddm.message dme
            inner join dme.author dma
            where dme.guildId = :guildId
            and dme.channelId = :channelId
            order by ddm.delimitationCreatedAt desc
        """.trimIndent()

        val query = entityManager.createQuery(sql, DiscordBuildMessageDTO::class.java)
        query.setParameter("guildId", guildId)
        query.setParameter("channelId", channelId)
        query.setMaxResults(1)
        return try {
            query.singleResult
        } catch (e: NoResultException) {
            null
        }
    }
}