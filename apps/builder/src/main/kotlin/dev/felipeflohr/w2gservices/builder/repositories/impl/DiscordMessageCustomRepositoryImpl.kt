package dev.felipeflohr.w2gservices.builder.repositories.impl

import dev.felipeflohr.w2gservices.builder.dto.GuildAndChannelDTO
import dev.felipeflohr.w2gservices.builder.repositories.DiscordMessageCustomRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository

@Repository
class DiscordMessageCustomRepositoryImpl(
    @PersistenceContext private val entityManager: EntityManager,
) : DiscordMessageCustomRepository {
    override fun findAllDistinctGuildIdsAndChannelIds(): Set<GuildAndChannelDTO> {
        val sql = """
            select distinct new ${GuildAndChannelDTO::class.java.name}(dme.guildId as guildId, dme.channelId as channelId)
            from DiscordDelimitationMessageEntity ddm
            inner join ddm.message dme
        """.trimIndent()
        val query = entityManager.createQuery(sql, GuildAndChannelDTO::class.java)
        return query.resultList.toSet()
    }
}