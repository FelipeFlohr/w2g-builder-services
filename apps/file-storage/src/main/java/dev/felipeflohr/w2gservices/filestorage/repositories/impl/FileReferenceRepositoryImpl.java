package dev.felipeflohr.w2gservices.filestorage.repositories.impl;

import dev.felipeflohr.w2gservices.filestorage.entities.FileReferenceEntity;
import dev.felipeflohr.w2gservices.filestorage.repositories.FileReferenceRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class FileReferenceRepositoryImpl implements FileReferenceRepository {
    @Override
    public Optional<FileReferenceEntity> findByFileHash(String hash) {
        return find("fileHash", hash).firstResultOptional();
    }
}
