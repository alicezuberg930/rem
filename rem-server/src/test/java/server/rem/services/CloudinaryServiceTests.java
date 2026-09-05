package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import server.rem.dtos.file.CloudinaryUploadResponse;

class CloudinaryServiceTests {
    private final CloudinaryService cloudinaryService = new CloudinaryService(new ObjectMapper());

    @Test
    void extractsVersionlessPublicIdWithoutExtension() {
        assertEquals(
                "customers/avatar",
                cloudinaryService.extractPublicId(
                        "https://res.cloudinary.com/demo/image/upload/v123456/customers/avatar.png"
                )
        );
    }

    @Test
    void rejectsUploadWhenCredentialsAreMissing() {
        assertThrows(IllegalArgumentException.class, () -> cloudinaryService.uploadFiles(List.of(), null, null));
    }

    @Test
    void deserializesCloudinaryUploadResponse() throws Exception {
        CloudinaryUploadResponse response = new ObjectMapper().readValue(
                "{\"secure_url\":\"https://res.cloudinary.com/demo/image/upload/avatar.png\"}",
                CloudinaryUploadResponse.class);

        assertEquals(
                "https://res.cloudinary.com/demo/image/upload/avatar.png",
                response.getSecureUrl());
    }
}
