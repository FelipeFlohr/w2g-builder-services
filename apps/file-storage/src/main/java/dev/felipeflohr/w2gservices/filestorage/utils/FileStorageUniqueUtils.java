package dev.felipeflohr.w2gservices.filestorage.utils;

import java.util.UUID;

public class FileStorageUniqueUtils {
    public static String generateUuidV4() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
}
