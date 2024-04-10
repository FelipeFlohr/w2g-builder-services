package dev.felipeflohr.w2gservices.filestorage.repositories.impl;

import dev.felipeflohr.w2gservices.filestorage.base.FileStorageBaseRepository;
import dev.felipeflohr.w2gservices.filestorage.entities.LocalFileEntity;
import dev.felipeflohr.w2gservices.filestorage.repositories.FileReferenceRepository;
import dev.felipeflohr.w2gservices.filestorage.repositories.LocalFileRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.hibernate.ScrollMode;
import org.hibernate.ScrollableResults;

import java.util.function.Consumer;

@ApplicationScoped
public class LocalFileRepositoryImpl extends FileStorageBaseRepository implements LocalFileRepository {
    @Inject
    FileReferenceRepository fileReferenceEntity;

    @Override
    public void consumeAllEntities(Consumer<LocalFileEntity> consumer) {
        var sql = "from LocalFileEntity";
        org.hibernate.query.Query<LocalFileEntity> query = getSession().createQuery(sql, LocalFileEntity.class);

        try (ScrollableResults<LocalFileEntity> scroll = query.scroll(ScrollMode.FORWARD_ONLY)) {
            while (scroll.next()) {
                LocalFileEntity entity = scroll.get();
                consumer.accept(entity);
            }
        } finally {
            getSession().flush();
            getSession().clear();
        }
    }

    @Override
    @Transactional
    public void deleteByIdWithFileReferenceEntity(Long id) {
        Long fileReferenceId = getFileReferenceEntityIdById(id);
        fileReferenceEntity.deleteById(fileReferenceId);
        deleteById(id);

        getSession().flush();
        getSession().clear();
    }

    private Long getFileReferenceEntityIdById(Long id) {
        var sql = """
            select lfi.reference.id
            from LocalFileEntity lfi
            where lfi.id = :id
        """;

        Query query = entityManager.createQuery(sql);
        query.setParameter("id", id);
        return (Long) query.getSingleResult();
    }
}
