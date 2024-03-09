package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table

@Entity
@Table(name = "TB_MESSAGE_FILE_REFERENCE")
class MessageFileReferenceEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MESSAGE_FILE_REFERENCE")
    @SequenceGenerator(name = "MESSAGE_FILE_REFERENCE", sequenceName = "\"MESSAGE_FILE_PK\"")
    @Column(name = "MFR_ID")
    var id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "MFR_DMEID", referencedColumnName = "DME_ID", nullable = false)
    var message: DiscordMessageEntity,

    @Column(name = "MFR_URL", length = 2048, nullable = false, unique = true)
    var url: String,

    @Column(name = "MFR_HASH", length = 64, nullable = false)
    var fileHash: String,
) : BuilderBaseEntity() {
    override fun toString(): String {
        return "MessageFileReferenceEntity(id=$id, messageId=${message.id}, url='$url', fileHash='$fileHash')"
    }
}
