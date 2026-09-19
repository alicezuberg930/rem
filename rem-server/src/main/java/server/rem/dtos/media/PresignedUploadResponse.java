package server.rem.dtos.media;

public record PresignedUploadResponse(
        String storageKey,
        String uploadUrl) {
}
