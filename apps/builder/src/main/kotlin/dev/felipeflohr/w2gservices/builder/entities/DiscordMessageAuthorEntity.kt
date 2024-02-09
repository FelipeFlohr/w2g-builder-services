package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "TB_DISCORD_MESSAGE_AUTHOR")
class DiscordMessageAuthorEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DMA_ID")
    var id: Long? = null,

    @Column(name = "DMA_AVAPNGURL", length = 512, nullable = true)
    var avatarPngUrl: String?,

    @Column(name = "DMA_BANPNGURL", length = 512, nullable = true)
    var bannerPngUrl: String?,

    @Column(name = "DMA_BOT", nullable = false)
    var bot: Boolean,

    @Column(name = "DMA_AUT_CREATED_AT", nullable = false)
    var autCreatedAt: Date,

    @Column(name = "DMA_DIS_NAME", length = 128, nullable = false)
    var displayName: String,

    @Column(name = "DMA_GNAME", length = 128, nullable = true)
    var globalName: String?,

    @Column(name = "DMA_AUTID", length = 32, nullable = false)
    var authorId: String,

    @Column(name = "DMA_SYS", length = 128, nullable = false)
    var system: Boolean,

    @Column(name = "DMA_USERNAME", nullable = false)
    var username: String,

    @OneToOne(mappedBy = "author", cascade = [CascadeType.ALL])
    var message: DiscordMessageEntity?,
) : BuilderBaseEntity()