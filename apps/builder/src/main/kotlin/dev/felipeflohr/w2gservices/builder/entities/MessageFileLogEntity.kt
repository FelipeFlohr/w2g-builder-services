package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@NoArg
@Table("\"TB_MESSAGE_FILE_LOG\"")
data class MessageFileLogEntity(
    @Id
    @Column("\"MFL_ID\"")
    var id: Long? = null,

    @Column("\"MFL_DMEID\"")
    var messageId: Long,

    @Column("\"MFL_BODY\"")
    var body: String,
) : BuilderBaseEntity()
