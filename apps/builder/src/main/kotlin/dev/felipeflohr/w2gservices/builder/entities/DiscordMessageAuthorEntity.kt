package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@NoArg
@Table("\"TB_DISCORD_MESSAGE_AUTHOR\"")
class DiscordMessageAuthorEntity(
    @Id
    @Column("\"DMA_ID\"")
    var id: Long? = null,

    @Column("\"DMA_AVAPNGURL\"")
    var avatarPngUrl: String?,

    @Column("\"DMA_BANPNGURL\"")
    var bannerPngUrl: String?,

    @Column("\"DMA_BOT\"")
    var bot: Boolean? = false,

    @Column("\"DMA_AUT_CREATED_AT\"")
    var autCreatedAt: Instant,

    @Column("\"DMA_DIS_NAME\"")
    var displayName: String,

    @Column("\"DMA_GNAME\"")
    var globalName: String?,

    @Column("\"DMA_AUTID\"")
    var authorId: String,

    @Column("\"DMA_SYS\"")
    var system: Boolean? = false,

    @Column("\"DMA_USERNAME\"")
    var username: String,
) : BuilderBaseEntity()
