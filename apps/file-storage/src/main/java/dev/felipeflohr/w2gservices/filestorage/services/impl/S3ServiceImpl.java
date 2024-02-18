package dev.felipeflohr.w2gservices.filestorage.services.impl;

import dev.felipeflohr.w2gservices.filestorage.models.S3ObjectDTO;
import dev.felipeflohr.w2gservices.filestorage.services.S3Service;
import dev.felipeflohr.w2gservices.filestorage.utils.UniqueUtils;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@AllArgsConstructor
@Service
public class S3ServiceImpl implements S3Service {
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Value("#{s3Configuration.bucketName}")
    private final String bucketName;
    private final S3Client client;

    @PostConstruct
    private void init() {
        if (!bucketExists(bucketName)) {
            createBucket(bucketName);
        }
    }

    public S3ObjectDTO saveFile(MultipartFile file) {
        String key = UniqueUtils.generateUuidV4();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try {
            client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return new S3ObjectDTO(key, bucketName, file.getSize());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public InputStream getFile(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            return client.getObject(getObjectRequest);
        } catch (NoSuchKeyException e) {
            log.warn(String.format("No file found for key \"%s\"", key));
            return null;
        }
    }

    private void createBucket(String bucketName) {
        CreateBucketRequest createBucketRequest = CreateBucketRequest.builder()
                .bucket(bucketName)
                .build();

        client.createBucket(createBucketRequest);
        log.info(String.format("Created bucket \"%s\".", bucketName));
    }

    private boolean bucketExists(String bucketName) {
        try {
            HeadBucketRequest request = HeadBucketRequest.builder()
                    .bucket(bucketName)
                    .build();
            client.headBucket(request);

            log.info(String.format("Bucket \"%s\" exist.", bucketName));
            return true;
        } catch (NoSuchBucketException e) {
            log.info(String.format("Bucket \"%s\" does not exist.", bucketName));
            return false;
        }
    }
}
