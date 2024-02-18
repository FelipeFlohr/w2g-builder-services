package dev.felipeflohr.w2gservices.filestorage.controllers;

import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.services.FileService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("file")
@AllArgsConstructor(onConstructor_={@Autowired})
public class FileController {
    private FileService service;

    @PostMapping
    private SavedFileDTO saveFile(@RequestParam("file") MultipartFile file) {
        return service.saveFile(file);
    }

    @GetMapping("/{fileHash}")
    private ResponseEntity<Resource> getFile(@PathVariable String fileHash) {
        try {
            PersistedFileDTO file = service.getFileByHash(fileHash);
            if (file == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(new InputStreamResource(file.getStream()));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
