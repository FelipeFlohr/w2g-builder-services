package dev.felipeflohr.w2gservices.filestorage.repositories;

import dev.felipeflohr.w2gservices.filestorage.entities.FileReferenceEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import java.util.Optional;

public interface FileReferenceRepository extends PanacheRepository<FileReferenceEntity> {
    Optional<FileReferenceEntity> findByFileHash(String hash);
}
