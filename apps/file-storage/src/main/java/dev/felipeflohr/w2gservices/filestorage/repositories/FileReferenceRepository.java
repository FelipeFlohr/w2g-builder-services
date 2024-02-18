package dev.felipeflohr.w2gservices.filestorage.repositories;

import dev.felipeflohr.w2gservices.filestorage.entities.FileReferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileReferenceRepository extends JpaRepository<FileReferenceEntity, Long> {
    FileReferenceEntity getFileReferenceEntityByFileHash(String hash);
}
