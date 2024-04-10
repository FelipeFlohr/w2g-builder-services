package dev.felipeflohr.w2gservices.filestorage.models;

import jakarta.ws.rs.core.MediaType;
import lombok.Builder;
import lombok.Data;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.server.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.Serializable;

@Data
@Builder
public class FileFormDTO implements Serializable {
    @RestForm
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    private File file;

    private String fileName;
    private String mimeType;

    public static FileFormDTO fromMultipartFormDataInput(MultipartFormDataInput formData) {
        FileFormDTOBuilder builder = FileFormDTO.builder();
        formData
            .getValues()
            .get("file")
            .stream()
            .findFirst()
            .ifPresent(formValue -> {
                builder.file(formValue.getFileItem().getFile().toFile());
                builder.fileName(formValue.getFileName());
                builder.mimeType(formValue.getHeaders().getFirst("Content-Type"));
            });

        return builder.build();
    }
}
