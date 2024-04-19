package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DiscordDelimitationMessageRepository : CrudRepository<DiscordDelimitationMessageEntity, Long> {
    @Query("""
        select ddm.id
        from DiscordDelimitationMessageEntity ddm
        inner join ddm.message dme
        where dme.guildId = :guildId
        and dme.channelId = :channelId
    """)
    fun findIdByGuildIdAndChannelId(guildId: String, channelId: String): Long?
}
