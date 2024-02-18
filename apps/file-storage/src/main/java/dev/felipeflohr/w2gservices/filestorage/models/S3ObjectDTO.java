package dev.felipeflohr.w2gservices.filestorage.models;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class S3ObjectDTO {
    @Nonnull private String key;
    @Nonnull private String bucketName;
    private long fileLength;
}
