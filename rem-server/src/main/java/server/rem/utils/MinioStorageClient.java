package server.rem.utils;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.Http;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.MinioException;

@Component
public class MinioStorageClient {

    private static final long MAX_PRESIGNED_URL_EXPIRY_SECONDS = Duration.ofDays(7).toSeconds();

    private final MinioClient client;
    private final MinioClient presigningClient;
    private final String bucketName;
    private final Duration downloadUrlExpiry;
    private final Duration shareUrlExpiry;
    private volatile boolean bucketReady;

    public MinioStorageClient(
            @Value("${minio.endpoint:http://localhost:9000}") String endpoint,
            @Value("${minio.public-endpoint:${minio.endpoint:http://localhost:9000}}") String publicEndpoint,
            @Value("${minio.access-key:${MINIO_ROOT_USER:admin}}") String accessKey,
            @Value("${minio.secret-key:${MINIO_ROOT_PASSWORD:minioadmin}}") String secretKey,
            @Value("${minio.bucket:rem-storage}") String bucketName,
            @Value("${minio.download-url-expiry-seconds:900}") long downloadUrlExpirySeconds,
            @Value("${minio.share-url-expiry-seconds:86400}") long shareUrlExpirySeconds) {

        this.bucketName = bucketName;
        this.downloadUrlExpiry = validateExpiry(Duration.ofSeconds(downloadUrlExpirySeconds));
        this.shareUrlExpiry = validateExpiry(Duration.ofSeconds(shareUrlExpirySeconds));
        this.client = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        this.presigningClient = endpoint.equals(publicEndpoint)
                ? client
                : MinioClient
                        .builder()
                        .endpoint(publicEndpoint)
                        .credentials(accessKey, secretKey).build();
    }

    /**
     * Verifies the MinIO connection and creates the configured private bucket
     * when it does not exist.
     */
    public MinioClient connect() {
        ensureBucketExists();
        return client;
    }

    /**
     * Uploads a multipart file under a generated, collision-resistant object
     * key.
     *
     * @return the object key to persist in {@code Media.storageKey}
     */
    public String upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty file is required");
        }
        return upload(file, generateObjectKey(file.getOriginalFilename()));
    }

    /**
     * Uploads a multipart file under the supplied object key.
     *
     * @return the normalized object key to persist in {@code Media.storageKey}
     */
    public String upload(MultipartFile file, String objectKey) {
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        String contentType = StringUtils.hasText(file.getContentType())
                ? file.getContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        try (InputStream input = file.getInputStream()) {
            return upload(input, file.getSize(), contentType, normalizedObjectKey);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to read upload for object '" + normalizedObjectKey + "'", exception);
        }
    }

    /**
     * Streams data to MinIO. The caller remains responsible for closing the
     * input stream.
     */
    public String upload(InputStream input, long objectSize, String contentType, String objectKey) {
        if (input == null) {
            throw new IllegalArgumentException("Upload input stream is required");
        }
        if (objectSize <= 0) {
            throw new IllegalArgumentException("Upload size must be greater than zero");
        }
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        String normalizedContentType = StringUtils.hasText(contentType)
                ? contentType
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        ensureBucketExists();
        execute("upload object '" + normalizedObjectKey + "'", () -> client.putObject(PutObjectArgs.builder()
                .bucket(bucketName)
                .object(normalizedObjectKey)
                .stream(input, objectSize, null)
                .contentType(normalizedContentType)
                .build()));
        return normalizedObjectKey;
    }

    /**
     * Generates an object key while retaining a safe version of the file
     * extension.
     */
    public String generateObjectKey(String originalFilename) {
        String extension = safeExtension(originalFilename);
        return CUIDGenerator.createId() + extension;
    }

    /**
     * Creates a short-lived GET URL that asks the browser to download the
     * object.
     */
    public String createPresignedDownloadUrl(String objectKey) {
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        return createPresignedDownloadUrl(
                normalizedObjectKey,
                filenameFromObjectKey(normalizedObjectKey),
                downloadUrlExpiry);
    }

    public String createPresignedDownloadUrl(String objectKey, String downloadFilename, Duration expiry) {
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        String normalizedFilename = downloadFilename
                .replace("\r", "")
                .replace("\n", "");
        String contentDisposition = ContentDisposition.attachment()
                .filename(normalizedFilename)
                .build()
                .toString();

        return presign(
                normalizedObjectKey,
                validateExpiry(expiry),
                Map.of("response-content-disposition", contentDisposition));
    }

    /**
     * Creates a GET URL suitable for sharing. Anyone with the URL can access
     * the object until it expires.
     */
    public String createPresignedShareUrl(String objectKey) {
        return createPresignedShareUrl(objectKey, shareUrlExpiry);
    }

    public String createPresignedShareUrl(String objectKey, Duration expiry) {
        return presign(normalizeObjectKey(objectKey), validateExpiry(expiry), Map.of());
    }

    public String getBucketName() {
        return bucketName;
    }

    private String presign(String objectKey, Duration expiry, Map<String, String> queryParameters) {
        return execute("create a presigned URL for object '" + objectKey + "'", () -> presigningClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                .method(Http.Method.GET)
                .bucket(bucketName)
                .object(objectKey)
                .expiry(Math.toIntExact(expiry.toSeconds()))
                .extraQueryParams(queryParameters)
                .build()));
    }

    private void ensureBucketExists() {
        if (bucketReady) {
            return;
        }

        synchronized (this) {
            if (bucketReady) {
                return;
            }

            boolean exists = execute("check bucket '" + bucketName + "'", () -> client.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build()));
            if (!exists) {
                execute("create bucket '" + bucketName + "'", () -> {
                    try {
                        client.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                    } catch (MinioException exception) {
                        boolean createdByAnotherInstance = client
                                .bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
                        if (!createdByAnotherInstance) {
                            throw exception;
                        }
                    }
                    return null;
                });
            }
            bucketReady = true;
        }
    }

    private static String normalizeObjectKey(String objectKey) {
        String normalized = objectKey
                .replace('\\', '/')
                .replaceAll("^/+", "")
                .replaceAll("/{2,}", "/");

        if (!StringUtils.hasText(normalized)
                || normalized.equals("..")
                || normalized.startsWith("../")
                || normalized.endsWith("/..")
                || normalized.contains("/../")) {
            throw new IllegalArgumentException("Object key must not contain parent path segments");
        }
        return normalized;
    }

    private static String safeExtension(String originalFilename) {
        if (!StringUtils.hasText(originalFilename)) {
            return "";
        }

        String filename = originalFilename.replace('\\', '/');
        filename = filename.substring(filename.lastIndexOf('/') + 1);
        int extensionStart = filename.lastIndexOf('.');
        if (extensionStart <= 0 || extensionStart == filename.length() - 1) {
            return "";
        }

        String extension = filename.substring(extensionStart + 1)
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
        return extension.isEmpty() ? "" : "." + extension.substring(0, Math.min(extension.length(), 16));
    }

    private static String filenameFromObjectKey(String objectKey) {
        return objectKey.substring(objectKey.lastIndexOf('/') + 1);
    }

    private static Duration validateExpiry(Duration expiry) {
        if (expiry == null || expiry.compareTo(Duration.ofSeconds(1)) < 0) {
            throw new IllegalArgumentException("Presigned URL expiry must be at least one second");
        }
        if (expiry.toSeconds() > MAX_PRESIGNED_URL_EXPIRY_SECONDS) {
            throw new IllegalArgumentException("Presigned URL expiry must not exceed seven days");
        }
        return expiry;
    }

    private static <T> T execute(String action, StorageOperation<T> operation) {
        try {
            return operation.run();
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("MinIO operation interrupted while attempting to " + action, exception);
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to " + action, exception);
        }
    }

    @FunctionalInterface
    private interface StorageOperation<T> {

        T run() throws Exception;
    }
}
