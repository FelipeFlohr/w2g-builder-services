package dev.felipeflohr.w2gservices.filestorage.services.impl;

import dev.felipeflohr.w2gservices.filestorage.entities.FileReferenceEntity;
import dev.felipeflohr.w2gservices.filestorage.exceptions.SaveFileException;
import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.S3ObjectDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.repositories.FileReferenceRepository;
import dev.felipeflohr.w2gservices.filestorage.services.FileService;
import dev.felipeflohr.w2gservices.filestorage.services.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@AllArgsConstructor(onConstructor_={@Autowired})
@Service
public class S3FileServiceImpl implements FileService {
    private S3Service service;
    private FileReferenceRepository repository;

    @Override
    public SavedFileDTO saveFile(MultipartFile file) throws SaveFileException {
        S3ObjectDTO object = service.saveFile(file);
        var entity = new FileReferenceEntity();
        entity.setFileName(file.getOriginalFilename());
        entity.setFileSize(file.getSize());
        entity.setMimeType(file.getContentType());
        entity.setFileHash(object.getKey());
        repository.save(entity);

        return new SavedFileDTO(entity.getFileHash(), entity.getFileName(), entity.getMimeType());
    }

    @Override
    public PersistedFileDTO getFileByHash(String fileHash) {
        FileReferenceEntity entity = repository.getFileReferenceEntityByFileHash(fileHash);
        InputStream fileStream = service.getFile(fileHash);

        if (entity != null && fileStream != null) {
            return new PersistedFileDTO(
                    entity.getFileHash(),
                    fileStream,
                    entity.getFileSize(),
                    entity.getFileName(),
                    entity.getMimeType()
            );
        }
        return null;
    }
}
