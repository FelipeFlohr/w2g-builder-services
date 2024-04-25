package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
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

@NoArg
@Entity
@Table(name = "TB_MESSAGE_FILE_LOG")
class MessageFileLogEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MESSAGE_FILE_LOG")
    @SequenceGenerator(name = "MESSAGE_FILE_LOG", sequenceName = "\"MESSAGE_FILE_LOG_PK\"")
    @Column(name = "MFL_ID")
    var id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "MFL_DMEID", referencedColumnName = "DME_ID", nullable = false)
    var message: DiscordMessageEntity,

    @Column(name = "MFL_BODY", nullable = false, columnDefinition = "TEXT")
    var body: String,

    @Column(name = "MFL_URL", nullable = true, length = 2048)
    var url: String?,
) : BuilderBaseEntity()
