package dev.felipeflohr.w2gservices.filestorage.models;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.InputStream;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersistedFileDTO implements Serializable {
    @Nonnull private String hash;
    @Nonnull private transient InputStream stream;
    @Nonnull private Long length;
    @Nonnull private String filename;
    @Nonnull private String mimeType;
}
