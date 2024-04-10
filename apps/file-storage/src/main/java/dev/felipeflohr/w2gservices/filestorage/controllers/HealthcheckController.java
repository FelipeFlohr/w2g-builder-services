package dev.felipeflohr.w2gservices.filestorage.controllers;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/healthcheck")
public class HealthcheckController {
    @GET
    public Response healthcheck() {
        return Response.noContent().build();
    }
}
