package dev.felipeflohr.w2gservices.filestorage.entities;

import dev.felipeflohr.w2gservices.filestorage.base.FileStorageBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TB_LOCAL_FILE")
public class LocalFileEntity extends FileStorageBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILE_REFERENCE")
    @SequenceGenerator(name = "FILE_REFERENCE", sequenceName = "FILE_REFERENCE_PK")
    @Column(name = "LFI_ID")
    private Long id;

    @Column(name = "LFI_PATH", nullable = false, length = 2048, unique = true)
    private String path;

    @OneToOne
    @JoinColumn(name = "LFI_FREID", nullable = false)
    private FileReferenceEntity reference;
}
