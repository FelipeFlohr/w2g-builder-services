package dev.felipeflohr.w2gservices.filestorage.services;

import dev.felipeflohr.w2gservices.filestorage.models.FileExistResultDTO;
import dev.felipeflohr.w2gservices.filestorage.models.FileFormDTO;
import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import jakarta.annotation.Nullable;

import java.util.Collection;
import java.util.List;

public interface FileService {
    SavedFileDTO save(FileFormDTO resource);
    @Nullable PersistedFileDTO getByHash(String fileHash);
    boolean existByHash(String fileHash);
    List<FileExistResultDTO> existByManyHashes(Collection<String> hashes);
}
