package server.rem.configurations;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import server.rem.utils.MinioStorageClient;

@Configuration
public class MinioConfig {

    @Bean
    public CommandLineRunner minioStorageInitializer(MinioStorageClient minioStorageClient) {
        return arguments -> minioStorageClient.connect();
    }
}
