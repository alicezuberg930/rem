package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

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
}
