package dev.felipeflohr.w2gservices.filestorage.models;

import jakarta.annotation.Nonnull;
import lombok.Data;

import java.io.Serializable;

@Data
public class SavedFileDTO implements Serializable {
    @Nonnull private String fileHash;
    @Nonnull private String fileName;
    @Nonnull private String mimeType;
}
