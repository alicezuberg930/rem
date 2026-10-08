package server.rem.configurations;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;
import server.rem.utils.MinioStorageClient;

@Slf4j
@Configuration
public class MinioConfig {

    @Bean
    @ConditionalOnProperty(
            prefix = "minio",
            name = "initialize-on-startup",
            havingValue = "true",
            matchIfMissing = true)
    public CommandLineRunner minioStorageInitializer(MinioStorageClient minioStorageClient) {
        return arguments -> {
            try {
                minioStorageClient.connect();
            } catch (Exception exception) {
                log.warn("MinIO is unavailable during startup. Storage endpoints will return 503 until it is reachable.", exception);
            }
        };
    }
}
