package dev.felipeflohr.w2gservices.builder.base

import java.time.Instant
import org.springframework.data.annotation.Version
import org.springframework.data.relational.core.mapping.Column

abstract class BuilderBaseEntity(
    @Column("\"CREATED_AT\"")
    var createdAt: Instant = Instant.now(),

    @Column("\"UPDATED_AT\"")
    var updatedAt: Instant = Instant.now(),

    @Version
    @Column("\"VERSION\"")
    var version: Long = 0L,
)
