package dev.felipeflohr.w2gservices.filestorage.entities;

import dev.felipeflohr.w2gservices.filestorage.base.FileStorageBaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "TB_FILE_REFERENCE")
public class FileReferenceEntity extends FileStorageBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "FILE_REFERENCE")
    @SequenceGenerator(name = "FILE_REFERENCE", sequenceName = "FILE_REFERENCE_PK")
    @Column(name = "FRE_ID")
    private Long id;

    @Column(name = "FRE_HASH", nullable = false, length = 36, unique = true)
    private String fileHash;

    @Column(name = "FRE_FILE_NAME", nullable = false, length = 1024)
    private String fileName;

    @Column(name = "FRE_MIME_TYPE", nullable = false, length = 256)
    private String mimeType;

    @Column(name = "FRE_FILE_SIZE", nullable = false)
    private Long fileSize;

    @OneToOne(mappedBy = "reference", orphanRemoval = true, fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    private LocalFileEntity localFileEntity;
}
