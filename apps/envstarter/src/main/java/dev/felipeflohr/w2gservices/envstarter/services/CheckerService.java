package dev.felipeflohr.w2gservices.envstarter.services;

import dev.felipeflohr.w2gservices.envstarter.utils.FileUtils;
import lombok.CustomLog;

import java.util.ArrayList;
import java.util.List;

@CustomLog
public class CheckerService {
    private static CheckerService instance;
    private static final String ENV_PATH = "/env";

    private CheckerService() {}

    public static CheckerService getInstance() {
        if (instance == null) {
            instance = new CheckerService();
        }
        return instance;
    }

    /**
     * Validates the path and returns a list containing the validation messages
     * @param path Path to validate
     * @return List containing validation messages. Returns an empty list if it
     * is valid.
     */
    public List<String> isValidPath(String path) {
        List<String> messages = new ArrayList<>();
        if (!isValidBuilder(path)) {
            var msg = "Invalid builder local environment files.";
            log.warn(msg);
            messages.add(msg);
        }
        if (!isValidDownloader(path)) {
            var msg = "Invalid downloader local environment file.";
            log.warn(msg);
            messages.add(msg);
        }
        if (!isValidFileStorage(path)) {
            var msg = "Invalid file storage local environment files.";
            log.warn(msg);
            messages.add(msg);
        }
        if (!isValidMessenger(path)) {
            var msg = "Invalid messenger local environment files.";
            log.warn(msg);
            messages.add(msg);
        }
        if (!isValidRabbitMQ(path)) {
            var msg = "Invalid RabbitMQ local environment file.";
            log.warn(msg);
            messages.add(msg);
        }

        return messages;
    }

    private boolean isValidBuilder(String path) {
        String localEnvPath = path + ENV_PATH + "/builder/local";
        String localEnv = localEnvPath + "/.env.builder-local";
        String localPostgresLocal = localEnvPath + "/.env.builder-postgres-local";

        return FileUtils.fileExist(localEnv) && FileUtils.fileExist(localPostgresLocal);
    }

    private boolean isValidDownloader(String path) {
        String localEnv = path + ENV_PATH + "/downloader/local/.env.downloader-local";
        return FileUtils.fileExist(localEnv);
    }

    private boolean isValidFileStorage(String path) {
        String localEnvPath = path + ENV_PATH + "/file-storage/local";
        String localEnv = localEnvPath + "/.env.file-storage-local";
        String localPostgresLocal = localEnvPath + "/.env.file-storage-postgres-local";

        return FileUtils.fileExist(localEnv) && FileUtils.fileExist(localPostgresLocal);
    }

    private boolean isValidMessenger(String path) {
        String localEnvPath = path + ENV_PATH + "/messenger/local";
        String localEnv = localEnvPath + "/.env.messenger-local";
        String localPostgresLocal = localEnvPath + "/.env.messenger-postgres-local";

        return FileUtils.fileExist(localEnv) && FileUtils.fileExist(localPostgresLocal);
    }

    private boolean isValidRabbitMQ(String path) {
        String localPath = path + ENV_PATH + "/rabbitmq/local/.env.rabbitmq-local";
        return FileUtils.fileExist(localPath);
    }
}
