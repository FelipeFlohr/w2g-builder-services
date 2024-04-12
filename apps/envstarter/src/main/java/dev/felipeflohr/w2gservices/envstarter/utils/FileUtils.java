package dev.felipeflohr.w2gservices.envstarter.utils;

import lombok.CustomLog;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@CustomLog
public class FileUtils {
    public static boolean fileExist(String path) {
        try {
            var file = new File(path);
            return file.exists() && file.isFile() && file.canRead();
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean fileNotExist(String path) {
        return !fileExist(path);
    }

    public static void copyFile(String from, String to) {
        try {
            Files.copy(Paths.get(from), Paths.get(to));
        } catch (IOException e) {
            log.error(e);
        }
    }

    public static void writeFile(String path, String content) {
        try {
            byte[] contentToBytes = content.getBytes();
            Files.write(Paths.get(path), contentToBytes);
        } catch (Exception e) {
            log.error(e);
        }
    }
}
