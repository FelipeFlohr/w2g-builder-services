package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import dev.felipeflohr.w2gservices.builder.dto.DiscordDelimitationMessageDTO
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "TB_DISCORD_DELIMITATION_MESSAGE")
class DiscordDelimitationMessageEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "DISCORD_DELIMITATION_MESSAGE")
    @SequenceGenerator(name = "DISCORD_DELIMITATION_MESSAGE", sequenceName = "\"DISCORD_DELIMITATION_MESSAGE_PK\"")
    @Column(name = "DDM_ID")
    var id: Long? = null,

    @Column(name = "DDM_CREATED_AT", nullable = false)
    var delimitationCreatedAt: Date,

    @OneToOne(targetEntity = DiscordMessageEntity::class, fetch = FetchType.LAZY, cascade = [CascadeType.MERGE])
    @JoinColumn(name = "DDM_DMEID", referencedColumnName = "DME_ID", nullable = false, unique = true)
    var message: DiscordMessageEntity,
) : BuilderBaseEntity() {
    companion object {
        @JvmStatic
        fun toEntity(delimitationDTO: DiscordDelimitationMessageDTO): DiscordDelimitationMessageEntity {
            return DiscordDelimitationMessageEntity(
                id = null,
                message = delimitationDTO.message.toEntity(),
                delimitationCreatedAt = delimitationDTO.createdAt,
            )
        }
    }
}