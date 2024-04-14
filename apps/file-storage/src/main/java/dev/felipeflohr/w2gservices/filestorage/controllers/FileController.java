package dev.felipeflohr.w2gservices.filestorage.controllers;

import dev.felipeflohr.w2gservices.filestorage.models.FileExistResultDTO;
import dev.felipeflohr.w2gservices.filestorage.models.FileFormDTO;
import dev.felipeflohr.w2gservices.filestorage.models.PersistedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.models.SavedFileDTO;
import dev.felipeflohr.w2gservices.filestorage.services.FileService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.server.multipart.MultipartFormDataInput;

import java.io.InputStream;
import java.util.Collection;
import java.util.List;

@Path("/file")
public class FileController {
    @Inject
    FileService service;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response saveFile(MultipartFormDataInput form) {
        SavedFileDTO savedFile = service.save(FileFormDTO.fromMultipartFormDataInput(form));
        return Response.ok(savedFile).build();
    }

    @GET
    @Path("/{fileHash}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response getFile(@PathParam("fileHash") String fileHash) {
        PersistedFileDTO persistedFile = service.getByHash(fileHash);
        if (persistedFile != null) {
            InputStream stream = persistedFile.getStream();
            return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"" + persistedFile.getFilename() + "\"")
                .build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Path("/existMany")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public List<FileExistResultDTO> existMany(Collection<String> hashes) {
        return service.existByManyHashes(hashes);
    }
}
