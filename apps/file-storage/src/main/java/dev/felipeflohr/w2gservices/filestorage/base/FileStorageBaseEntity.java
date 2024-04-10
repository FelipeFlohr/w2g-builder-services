package dev.felipeflohr.w2gservices.filestorage.base;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class FileStorageBaseEntity extends PanacheEntityBase {
    @Column(name = "CREATED_AT", nullable = false)
    @ColumnDefault("CURRENT_DATE")
    private Date createdAt = new Date();

    @Column(name = "UPDATED_AT", nullable = false)
    @ColumnDefault("CURRENT_DATE")
    private Date updatedAt = new Date();

    @Column(name = "VERSION", nullable = false)
    @ColumnDefault("0")
    private Integer version = 0;
}
