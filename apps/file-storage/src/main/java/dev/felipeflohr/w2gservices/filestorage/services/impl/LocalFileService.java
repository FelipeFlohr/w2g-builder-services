package dev.felipeflohr.w2gservices.filestorage.services.impl;

import dev.felipeflohr.w2gservices.filestorage.entities.FileReferenceEntity;
import dev.felipeflohr.w2gservices.filestorage.entities.LocalFileEntity;
import dev.felipeflohr.w2gservices.filestorage.models.FileExistResultDTO;
import dev.felipeflohr.w2gservices.filestorage.models.FileFormDTO;
import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.repositories.FileReferenceRepository;
import dev.felipeflohr.w2gservices.filestorage.repositories.LocalFileRepository;
import dev.felipeflohr.w2gservices.filestorage.services.FileService;
import dev.felipeflohr.w2gservices.filestorage.utils.FileStorageCompletableFutureUtils;
import dev.felipeflohr.w2gservices.filestorage.utils.FileStorageFileUtils;
import dev.felipeflohr.w2gservices.filestorage.utils.FileStorageUniqueUtils;
import io.quarkus.runtime.Startup;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.File;
import java.io.FileInputStream;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Slf4j
@Startup
@ApplicationScoped
public class LocalFileService implements FileService {
    @Inject
    FileReferenceRepository fileReferenceRepository;

    @Inject
    LocalFileRepository localFileRepository;

    @ConfigProperty(name = "filestorage.local.path")
    String localFileStoragePath;

    @PostConstruct
    public void init() {
        validateLocalFileStoragePath();
        removeStaleData();
    }

    @Transactional
    public void removeStaleData() {
        localFileRepository.consumeAllEntities(entity -> {
            if (FileStorageFileUtils.notExists(entity.getPath())) {
                localFileRepository.deleteByIdWithFileReferenceEntity(entity.getId());
                log.info("Deleted stale data #" + entity.getId() + ". Path: " + entity.getPath());
            }
        });
    }

    @Override
    @Transactional
    public SavedFileDTO save(FileFormDTO resource) {
        String fileHash = FileStorageUniqueUtils.generateUuidV4();
        String filePath = generateFilePath(fileHash, resource);
        copyFromTempToStorage(resource, filePath);
        return saveFile(resource, fileHash, filePath);
    }

    @SneakyThrows
    @Override
    public PersistedFileDTO getByHash(String fileHash) {
        Optional<FileReferenceEntity> entity = fileReferenceRepository.findByFileHash(fileHash);
        if (entity.isPresent()) {
            FileReferenceEntity reference = entity.get();
            var persistedFile = new PersistedFileDTO();
            var file = new File(reference.getLocalFileEntity().getPath());

            persistedFile.setHash(reference.getFileHash());
            persistedFile.setFilename(reference.getFileName());
            persistedFile.setMimeType(reference.getMimeType());
            persistedFile.setStream(new FileInputStream(file));
            persistedFile.setLength(FileUtils.sizeOf(file));
            return persistedFile;
        }
        return null;
    }

    @Override
    @Transactional
    public boolean existByHash(String fileHash) {
        Optional<FileReferenceEntity> entity = fileReferenceRepository.findByFileHash(fileHash);
        if (entity.isPresent()) {
            LocalFileEntity localFile = entity.get().getLocalFileEntity();
            if (FileStorageFileUtils.notExists(localFile.getPath())) {
                localFileRepository.deleteByIdWithFileReferenceEntity(localFile.getId());
                return false;
            }
            return true;
        }
        return false;
    }

    @Override
    public List<FileExistResultDTO> existByManyHashes(Collection<String> hashes) {
        return FileStorageCompletableFutureUtils.allOfVirtualThread(hashes, hash -> new FileExistResultDTO(hash, existByHash(hash)));
    }

    private void validateLocalFileStoragePath() {
        if (FileStorageFileUtils.directoryNotExists(localFileStoragePath)) {
            var error = new RuntimeException("The path " + localFileStoragePath + " is not a valid directory.");
            log.error("Failed to initialize " + this.getClass().getName(), error);
            throw error;
        }
    }

    private String generateFilePath(String fileHash, FileFormDTO resource) {
        String filename = fileHash + "-" + FilenameUtils.getName(resource.getFile().getName());
        return FilenameUtils.concat(localFileStoragePath + "/", filename);
    }

    @SneakyThrows
    private void copyFromTempToStorage(FileFormDTO resource, String filePath) {
        FileUtils.copyFile(resource.getFile(), new File(filePath));
        FileUtils.delete(resource.getFile());
    }

    private SavedFileDTO saveFile(FileFormDTO resource, String fileHash, String filePath) {
        Long fileSize = FileUtils.sizeOf(new File(filePath));
        var localFile = new LocalFileEntity(null, filePath, null);

        var entity = new FileReferenceEntity();
        entity.setFileHash(fileHash);
        entity.setFileSize(fileSize);
        entity.setFileName(resource.getFileName());
        entity.setMimeType(resource.getMimeType());
        entity.setLocalFileEntity(localFile);
        localFile.setReference(entity);

        fileReferenceRepository.persistAndFlush(entity);
        return new SavedFileDTO(entity.getFileHash(), entity.getFileName(), resource.getMimeType());
    }
}
