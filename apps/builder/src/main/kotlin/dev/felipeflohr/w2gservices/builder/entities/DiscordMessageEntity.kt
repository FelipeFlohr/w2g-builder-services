package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@NoArg
@Table("\"TB_DISCORD_MESSAGE\"")
data class DiscordMessageEntity(
    @Id
    @Column("\"DME_ID\"")
    var id: Long? = null,

    @Column("\"DME_DMAID\"")
    var authorId: Long,

    @Column("\"DME_CONTENT\"")
    var content: String,

    @Column("\"DME_MSG_CREATED_AT\"")
    var messageCreatedAt: Instant,

    @Column("\"DME_MSGID\"")
    var messageId: String,

    @Column("\"DME_PINNED\"")
    var pinned: Boolean,

    @Column("\"DME_POS\"")
    var position: Int?,

    @Column("\"DME_SYS\"")
    var system: Boolean,

    @Column("\"DME_URL\"")
    var url: String,

    @Column("\"DME_GUIID\"")
    var guildId: String,

    @Column("\"DME_CHAID\"")
    var channelId: String,
) : BuilderBaseEntity()
