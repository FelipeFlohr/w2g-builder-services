package dev.felipeflohr.w2gservices.filestorage.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class FileStorageBaseEntity {
    @Column(name = "CREATED_AT", nullable = false)
    public Date createdAt = new Date();

    @Column(name = "UPDATED_AT", nullable = false)
    public Date updatedAt = new Date();

    @Column(name = "VERSION", nullable = false)
    public Integer version = 0;
}
