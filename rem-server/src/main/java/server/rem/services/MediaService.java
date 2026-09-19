package server.rem.services;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.media.MediaResponse;
import server.rem.dtos.media.PresignedUploadResponse;
import server.rem.entities.BusinessUser;
import server.rem.entities.Media;
import server.rem.mappers.MediaMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.MediaPermissionRepository;
import server.rem.repositories.MediaRepository;
import server.rem.repositories.MediaShareLinkRepository;
import server.rem.utils.MinioStorageClient;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final int MAX_FILENAME_LENGTH = 255;
    private final MediaRepository mediaRepository;
    private final MediaPermissionRepository mediaPermissionRepository;
    private final MediaShareLinkRepository mediaShareLinkRepository;
    private final BusinessUserRepository businessUserRepository;
    private final MinioStorageClient minioStorageClient;
    private final MediaMapper mediaMapper;

    public MediaResponse upload(MultipartFile file, String businessId, String userId) {
        String filename = extractFilename(file);
        BusinessUser membership = getActiveMembership(userId, businessId);
        String storageKey = minioStorageClient.upload(file);
        Media media = mediaMapper.toEntity(
                membership.getBusiness(),
                membership.getUser(),
                storageKey,
                filename,
                file.getSize(),
                StringUtils.hasText(file.getContentType())
                        ? file.getContentType()
                        : "application/octet-stream",
                extractExtension(filename));
        return mediaMapper.toDto(mediaRepository.save(media));
    }

    public PresignedUploadResponse createPresignedUploadUrl(
            String originalFilename,
            String businessId,
            String userId) {
        String filename = extractFilename(originalFilename);
        getActiveMembership(userId, businessId);

        String storageKey = minioStorageClient.generateObjectKey(filename);
        String uploadUrl = minioStorageClient.createPresignedUploadUrl(storageKey);
        return new PresignedUploadResponse(storageKey, uploadUrl);
    }

    @Transactional
    public void delete(List<String> mediaIds, String businessId, String userId) {
        if (mediaIds == null || mediaIds.isEmpty()) {
            throw new IllegalArgumentException("At least one media ID is required");
        }
        if (mediaIds.stream().anyMatch(id -> !StringUtils.hasText(id))) {
            throw new IllegalArgumentException("Media IDs must not be blank");
        }

        getActiveMembership(userId, businessId);
        Set<String> requestedIds = mediaIds.stream()
                .map(String::trim)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        List<Media> media = mediaRepository.findAllByIdInAndBusinessId(requestedIds, businessId);
        Set<String> foundIds = media.stream()
                .map(Media::getId)
                .collect(Collectors.toSet());
        List<String> missingIds = requestedIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
        if (!missingIds.isEmpty()) {
            throw new ResourceNotFoundException("Media not found: " + String.join(", ", missingIds));
        }

        String[] storageKeys = media.stream()
                .map(Media::getStorageKey)
                .toArray(String[]::new);
        minioStorageClient.delete(storageKeys);

        mediaShareLinkRepository.deleteAllByMediaIdIn(requestedIds);
        mediaPermissionRepository.deleteAllByMediaIdIn(requestedIds);
        mediaRepository.deleteAll(media);
    }

    private String extractFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty file is required");
        }

        return extractFilename(file.getOriginalFilename());
    }

    private String extractFilename(String originalFilename) {
        String path = StringUtils.cleanPath(
                StringUtils.hasText(originalFilename) ? originalFilename : "")
                .replace('\\', '/');
        String filename = path.substring(path.lastIndexOf('/') + 1);
        if (!StringUtils.hasText(filename) || filename.equals(".") || filename.equals("..")
                || filename.indexOf('\r') >= 0 || filename.indexOf('\n') >= 0) {
            throw new IllegalArgumentException("File name is invalid");
        }
        if (filename.length() > MAX_FILENAME_LENGTH) {
            throw new IllegalArgumentException("File name must not exceed 255 characters");
        }
        return filename;
    }

    private BusinessUser getActiveMembership(String userId, String businessId) {
        return businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Active business user not found"));
    }

    private String extractExtension(String filename) {
        int extensionStart = filename.lastIndexOf('.');
        return extensionStart > 0 && extensionStart < filename.length() - 1
                ? filename.substring(extensionStart + 1)
                : "";
    }
}
