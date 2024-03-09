package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.DiscordBuildMessageDTO
import dev.felipeflohr.w2gservices.builder.repositories.BuilderCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext

class BuilderCustomRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager
) : BuilderCustomRepository {
    override fun getBuildMessages(guildId: String): Set<DiscordBuildMessageDTO> {
        val delimitationMessage = getDelimitationMessageByGuildId(guildId)
        val messagesAfterDelimitation = getDelimitationMessagesByGuildIdAfterDelimitationMessage(delimitationMessage)

        var messages: List<DiscordBuildMessageDTO> = arrayListOf(delimitationMessage)
        messages = messages + messagesAfterDelimitation
        return messages.toSet()
    }

    private fun getDelimitationMessagesByGuildIdAfterDelimitationMessage(delimitation: DiscordBuildMessageDTO): List<DiscordBuildMessageDTO> {
        val sql = """
            select new ${DiscordBuildMessageDTO::class.java.name}(
                dme.messageId as id,
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
            and dme.messageCreatedAt >= :createdAt
            and dme.messageId <> :delimitationMessageId
            order by dme.messageCreatedAt asc
        """.trimIndent()

        val query = entityManager.createQuery(sql, DiscordBuildMessageDTO::class.java)
        query.setParameter("guildId", delimitation.guildId)
        query.setParameter("createdAt", delimitation.createdAt)
        query.setParameter("delimitationMessageId", delimitation.id)
        return query.resultList
    }

    private fun getDelimitationMessageByGuildId(guildId: String): DiscordBuildMessageDTO {
        val sql = """
            select new ${DiscordBuildMessageDTO::class.java.name}(
                dme.messageId as id,
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
            order by ddm.delimitationCreatedAt desc
        """.trimIndent()

        val query = entityManager.createQuery(sql, DiscordBuildMessageDTO::class.java)
        query.setParameter("guildId", guildId)
        query.setMaxResults(1)
        return query.singleResult
    }
}