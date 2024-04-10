package dev.felipeflohr.w2gservices.filestorage.utils;

import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.util.function.Function;

public class FileStorageFileUtils {
    public static boolean exists(String path) {
        return pathToFileBooleanFunction(path, file -> file.isFile() && file.exists());
    }

    public static boolean notExists(String path) {
        return !exists(path);
    }

    public static boolean directoryExists(String path) {
        return pathToFileBooleanFunction(path, file -> file.isDirectory() && file.exists());
    }

    public static boolean directoryNotExists(String path) {
        return !directoryExists(path);
    }

    private static boolean pathToFileBooleanFunction(String path, Function<File, Boolean> function) {
        if (StringUtils.isNotBlank(path)) {
            var file = new File(path);
            return function.apply(file);
        }
        return false;
    }
}
