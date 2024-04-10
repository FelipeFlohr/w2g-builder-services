package dev.felipeflohr.w2gservices.filestorage.repositories;

import dev.felipeflohr.w2gservices.filestorage.entities.LocalFileEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;

import java.util.function.Consumer;

public interface LocalFileRepository extends PanacheRepository<LocalFileEntity> {
    void consumeAllEntities(Consumer<LocalFileEntity> consumer);
    void deleteByIdWithFileReferenceEntity(Long id);
}
