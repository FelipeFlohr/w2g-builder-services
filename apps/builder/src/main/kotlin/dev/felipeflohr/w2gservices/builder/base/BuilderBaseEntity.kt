package dev.felipeflohr.w2gservices.builder.base

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import jakarta.persistence.PreUpdate
import java.util.Date

@MappedSuperclass
abstract class BuilderBaseEntity(
    @Column(name = "CREATED_AT")
    var createdAt: Date = Date(),

    @Column(name = "UPDATED_AT")
    var updatedAt: Date = Date(),

    @Column(name = "VERSION")
    var version: Long = 0L,
) {
    @PreUpdate
    fun preUpdate() {
        updatedAt = Date()
        version++
    }
}
