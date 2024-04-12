package dev.felipeflohr.w2gservices.envstarter.services;

import dev.felipeflohr.w2gservices.envstarter.utils.FileUtils;
import dev.felipeflohr.w2gservices.envstarter.utils.PropertiesUtils;

import java.util.Map;

public class EnvironmentGeneratorService {
    private static final String BUILDER_PATH_LOCAL = "/env/builder/local";
    private static final String BUILDER_PATH_ENV = "/env/builder/env";
    private static final String DOWNLOADER_PATH_LOCAL = "/env/downloader/local";
    private static final String DOWNLOADER_PATH_ENV = "/env/downloader/env";
    private static final String FILE_STORAGE_PATH_LOCAL = "/env/file-storage/local";
    private static final String FILE_STORAGE_PATH_ENV = "/env/file-storage/env";
    private static final String MESSENGER_PATH_LOCAL = "/env/messenger/local";
    private static final String MESSENGER_PATH_ENV = "/env/messenger/env";
    private static final String RABBITMQ_PATH_LOCAL = "/env/rabbitmq/local";
    private static final String RABBITMQ_PATH_ENV = "/env/rabbitmq/env";
    private static EnvironmentGeneratorService instance;

    private EnvironmentGeneratorService() {}

    public void generateFiles(String path, String discordToken) {
        generateBuilderFiles(path);
        generateDownloaderFiles(path);
        generateFileStorageFiles(path);
        generateMessengerFiles(path, discordToken);
        generateRabbitMQFiles(path);
    }

    private void generateRabbitMQFiles(String path) {
        generateFile(path, RABBITMQ_PATH_LOCAL, RABBITMQ_PATH_ENV, ".env.rabbitmq");
    }

    private void generateMessengerFiles(String path, String discordToken) {
        String localEnvPath = path + MESSENGER_PATH_LOCAL + "/.env.messenger-local";
        String localPostgresPath = path + MESSENGER_PATH_LOCAL + "/.env.messenger-postgres-local";
        String envPath = path + MESSENGER_PATH_ENV + "/.env.messenger";
        String postgresPath = path + MESSENGER_PATH_ENV + "/.env.messenger-postgres";

        if (FileUtils.fileNotExist(envPath)) {
            Map<String, String> props = PropertiesUtils.readPropertyFileToMap(localEnvPath);
            props.put("DISCORD_TOKEN", discordToken);

            String stringProps = PropertiesUtils.propertyMapToPropertyString(props);
            FileUtils.writeFile(envPath, stringProps);
        }
        if (FileUtils.fileNotExist(postgresPath)) {
            FileUtils.copyFile(localPostgresPath, postgresPath);
        }
    }

    private void generateFileStorageFiles(String path) {
        generateFileWithPostgres(path, FILE_STORAGE_PATH_LOCAL, FILE_STORAGE_PATH_ENV, ".env.file-storage");
    }

    private void generateDownloaderFiles(String path) {
        generateFile(path, DOWNLOADER_PATH_LOCAL, DOWNLOADER_PATH_ENV, ".env.downloader");
    }

    private void generateBuilderFiles(String path) {
        generateFileWithPostgres(path, BUILDER_PATH_LOCAL, BUILDER_PATH_ENV, ".env.builder");
    }

    private void generateFileWithPostgres(String path, String localFolder, String envFolder, String env) {
        generateFile(path, localFolder, envFolder, env);
        generateFile(path, localFolder, envFolder, env + "-postgres");
    }

    private void generateFile(String path, String localFolder, String envFolder, String env) {
        String localEnvPath = path + localFolder + "/" + env + "-local";
        String envPath = path + envFolder + "/" + env;

        if (FileUtils.fileNotExist(envPath)) {
            FileUtils.copyFile(localEnvPath, envPath);
        }
    }

    public static EnvironmentGeneratorService getInstance() {
        if (instance == null) {
            instance = new EnvironmentGeneratorService();
        }
        return instance;
    }
}
