package dev.felipeflohr.w2gservices.builder.repositories

import dev.felipeflohr.w2gservices.builder.entities.DiscordMessageEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface DiscordMessageRepository : JpaRepository<DiscordMessageEntity, Long>, DiscordMessageCustomRepository {
    @Query("select (count(dme) > 0) from DiscordMessageEntity dme where dme.messageId = :messageId")
    fun existsByMessageId(messageId: String): Boolean

    @Query("select id from DiscordMessageEntity where messageId = :messageId")
    fun getMessageIdByDiscordMessageId(messageId: String): Long?

    @Query("from DiscordMessageEntity dme join fetch dme.author dma where dme.messageId = :messageId")
    fun getByMessageId(messageId: String): DiscordMessageEntity?

    fun getAllByFileReferencesEmptyAndFileLogsEmpty(): List<DiscordMessageEntity>

    @Query("""
        select distinct dme.channelId
        from DiscordDelimitationMessageEntity ddm
        inner join ddm.message dme
        where dme.guildId = :guildId
    """)
    fun getAllDistinctChannelIdsByGuildId(guildId: String): Set<String>

    fun getAllByMessageIdIn(messageIds: Collection<String>): List<DiscordMessageEntity>

    @Modifying
    @Transactional
    fun deleteByMessageId(messageId: String)

    @Query("select dme.author.id from DiscordMessageEntity dme where dme.messageId = :messageId")
    fun getAuthorIdByMessageId(messageId: String): Long?

    @Query("select distinct dme.guildId from DiscordMessageEntity dme")
    fun getDistinctGuildIds(): Set<String>

//    @Transactional
//    @Modifying
//    fun updateAndFlush(message: DiscordMessageDTO): DiscordMessageEntity? {
//        update(message)
//        return getByMessageId(message.id)
//    }
}
