package dev.felipeflohr.w2gservices.builder.entities

import dev.felipeflohr.w2gservices.builder.annotations.NoArg
import dev.felipeflohr.w2gservices.builder.base.BuilderBaseEntity
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@NoArg
@Table("\"TB_MESSAGE_FILE_REFERENCE\"")
data class MessageFileReferenceEntity(
    @Id
    @Column("\"MFR_ID\"")
    var id: Long? = null,

    @Column("\"MFR_DMEID\"")
    var messageId: Long,

    @Column("\"MFR_URL\"")
    var url: String,

    @Column("\"MFR_HASH\"")
    var fileHash: String,
) : BuilderBaseEntity()
