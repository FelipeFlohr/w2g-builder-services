package dev.felipeflohr.w2gservices.filestorage.models;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class FileExistResultDTO implements Serializable {
    @Nonnull private String hash;
    private boolean exist;
}
