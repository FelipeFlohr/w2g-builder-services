package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import java.util.Date
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageRepository : CrudRepository<DiscordMessageEntity, Long>, DiscordMessageCustomRepository {
    @Query("select dme.id from DiscordMessageEntity dme where dme.messageId = :messageId")
    fun findIdByMessageId(messageId: String): Long?

    @Query("select dme.author.id from DiscordMessageEntity dme where dme.id = :id")
    fun findAuthorIdById(id: Long): Long

    @Query("""
        from DiscordMessageEntity dme
        where
            not exists (
                from MessageFileReferenceEntity mfr
                where mfr.message.id = dme.id
            )
            and not exists (
                from MessageFileLogEntity mfl
                where mfl.message.id = dme.id
            )
        
    """)
    fun findAllByFileReferencesEmptyAndFileLogsEmpty(): List<DiscordMessageEntity>

    @Query("""
        select distinct dme.channelId
        from DiscordDelimitationMessageEntity ddm
        inner join ddm.message dme
        where dme.guildId = :guildId
    """)
    fun findAllDistinctChannelIdsByGuildId(guildId: String): Set<String>

    fun findAllByGuildIdAndChannelIdAndMessageCreatedAtAfter(guildId: String, channelId: String, messageCreatedAt: Date): List<DiscordMessageEntity>
}
