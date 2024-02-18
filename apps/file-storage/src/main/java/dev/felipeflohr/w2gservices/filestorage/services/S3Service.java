package dev.felipeflohr.w2gservices.filestorage.services;

import dev.felipeflohr.w2gservices.filestorage.models.S3ObjectDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface S3Service {
    S3ObjectDTO saveFile(MultipartFile file);
    InputStream getFile(String key);
}
