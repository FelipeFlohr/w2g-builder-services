package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import java.time.Instant
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@NoArg
@Table("\"TB_DISCORD_DELIMITATION_MESSAGE\"")
data class DiscordDelimitationMessageEntity(
    @Id
    @Column("\"DDM_ID\"")
    var id: Long? = null,

    @Column("\"DDM_CREATED_AT\"")
    var delimitationCreatedAt: Instant,

    @Column("\"DDM_DMEID\"")
    var messageId: Long,
) : BuilderBaseEntity()
