package dev.felipeflohr.w2gservices.filestorage.base;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.hibernate.Session;

public abstract class FileStorageBaseRepository {
    @Inject
    protected EntityManager entityManager;

    protected Session getSession() {
        return entityManager.unwrap(Session.class);
    }
}
