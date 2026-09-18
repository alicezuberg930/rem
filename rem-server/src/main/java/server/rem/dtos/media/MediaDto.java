package server.rem.dtos.media;

import server.rem.enums.MediaStatus;
import server.rem.enums.MediaType;

public record MediaDto(
        String id,
        String storageKey,
        String name,
        MediaType type,
        String parentId,
        Long size,
        String mimeType,
        String extension,
        MediaStatus status
) {}
