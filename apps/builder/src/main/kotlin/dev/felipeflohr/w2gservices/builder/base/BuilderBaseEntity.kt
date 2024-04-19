package dev.felipeflohr.w2gservices.builder.base

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import jakarta.persistence.Version
import java.util.Date

@MappedSuperclass
abstract class BuilderBaseEntity (
    @Column(name = "CREATED_AT")
    var createdAt: Date = Date(),

    @Column(name = "UPDATED_AT")
    var updatedAt: Date = Date(),

    @Version
    @Column(name = "VERSION")
    var version: Long = 0L,
)
