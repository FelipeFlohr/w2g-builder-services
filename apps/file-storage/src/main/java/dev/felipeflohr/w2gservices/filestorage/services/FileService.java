package dev.felipeflohr.w2gservices.filestorage.services;

import dev.felipeflohr.w2gservices.filestorage.exceptions.SaveFileException;
import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface FileService {
    SavedFileDTO saveFile(MultipartFile file) throws SaveFileException;
    PersistedFileDTO getFileByHash(String fileHash);
}
