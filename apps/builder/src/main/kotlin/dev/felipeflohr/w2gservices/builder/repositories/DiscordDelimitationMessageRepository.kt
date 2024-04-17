package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordDelimitationMessageEntity
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Mono

@Repository
interface DiscordDelimitationMessageRepository : ReactiveCrudRepository<DiscordDelimitationMessageEntity, Long> {
    @Query("""
        SELECT ddm."DDM_ID"
        FROM "TB_DISCORD_DELIMITATION_MESSAGE" ddm
        INNER JOIN "TB_DISCORD_MESSAGE" dme ON ddm."DDM_DMEID" = dme."DME_ID"
        WHERE dme."DME_GUIID" = :guildId
            AND dme."DME_CHAID" = :channelId
        LIMIT 1
    """)
    fun findIdByGuildIdAndChannelId(guildId: String, channelId: String): Mono<Long?>
}
