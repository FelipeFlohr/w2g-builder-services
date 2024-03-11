package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "TB_DISCORD_MESSAGE")
class DiscordMessageEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DISCORD_MESSAGE")
    @SequenceGenerator(name = "DISCORD_MESSAGE", sequenceName = "\"DISCORD_MESSAGE_PK\"")
    @Column(name = "DME_ID")
    var id: Long? = null,

    @OneToOne(targetEntity = DiscordMessageAuthorEntity::class, fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "DME_DMAID", referencedColumnName = "DMA_ID", nullable = false)
    var author: DiscordMessageAuthorEntity,

    @Column(name = "DME_CONTENT", length = 8192, nullable = false)
    var content: String,

    @Column(name = "DME_MSG_CREATED_AT")
    var messageCreatedAt: Date,

    @Column(name = "DME_MSGID", length = 32, nullable = false, unique = true)
    var messageId: String,

    @Column(name = "DME_PINNED", nullable = false)
    var pinned: Boolean,

    @Column(name = "DME_POS", nullable = true)
    var position: Int?,

    @Column(name = "DME_SYS", length = 128, nullable = false)
    var system: Boolean,

    @Column(name = "DME_URL", length = 1024, nullable = false)
    var url: String,

    @Column(name = "DME_GUIID", length = 64, nullable = false)
    var guildId: String,

    @Column(name = "DME_CHAID", length = 64, nullable = false)
    var channelId: String,

    @OneToOne(mappedBy = "message", orphanRemoval = true)
    var delimitationMessage: DiscordDelimitationMessageEntity?,

    @OneToMany(mappedBy = "message", orphanRemoval = true)
    var fileReferences: Set<MessageFileReferenceEntity>?,

    @OneToMany(mappedBy = "message", orphanRemoval = true)
    var fileLogs: Set<MessageFileLogEntity>?,
) : BuilderBaseEntity()