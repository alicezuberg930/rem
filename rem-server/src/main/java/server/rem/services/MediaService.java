package server.rem.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.media.MediaResponse;
import server.rem.dtos.media.PresignedDownloadResponse;
import server.rem.dtos.media.PresignedPreviewResponse;
import server.rem.dtos.media.PresignedUploadResponse;
import server.rem.dtos.media.QueryMedia;
import server.rem.entities.BusinessUser;
import server.rem.entities.Media;
import server.rem.enums.MediaStatus;
import server.rem.enums.MediaType;
import server.rem.mappers.MediaMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.MediaPermissionRepository;
import server.rem.repositories.MediaRepository;
import server.rem.repositories.MediaShareLinkRepository;
import server.rem.specifications.MediaSpecification;
import server.rem.utils.CUIDGenerator;
import server.rem.utils.MinioStorageClient;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class MediaService {
    private static final int MAX_FILENAME_LENGTH = 255;
    private static final int MAX_RELATIVE_PATH_LENGTH = 4096;
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 100;
    private static final String FOLDER_MIME_TYPE = "application/vnd.rem.folder";
    private final MediaRepository mediaRepository;
    private final MediaPermissionRepository mediaPermissionRepository;
    private final MediaShareLinkRepository mediaShareLinkRepository;
    private final BusinessUserRepository businessUserRepository;
    private final MinioStorageClient minioStorageClient;
    private final MediaMapper mediaMapper;

    @Transactional(readOnly = true)
    public CustomPageResponse<MediaResponse> getAll(QueryMedia query, String businessId, String userId) {
        getActiveMembership(userId, businessId);
        int page = query.getPage() == null ? 0 : Math.max(query.getPage(), 0);
        int requestedPageSize = query.getPageSize() == null ? DEFAULT_PAGE_SIZE : query.getPageSize();
        int pageSize = Math.max(1, Math.min(requestedPageSize, MAX_PAGE_SIZE));
        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id")));
        Specification<Media> specification = MediaSpecification.withFilters(MediaStatus.ACTIVE, businessId);
        Page<MediaResponse> media = mediaRepository.findAll(specification, pageable).map(mediaMapper::toDto);
        return new CustomPageResponse<>(media);
    }

    @Transactional
    public List<MediaResponse> upload(List<MultipartFile> files, List<String> paths, String parentId, String businessId,
            String userId) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one file is required");
        }
        List<String> filenames = files.stream().map(this::extractFilename).toList();
        List<List<String>> uploadPaths = normalizeUploadPaths(filenames, paths);
        BusinessUser membership = getActiveMembership(userId, businessId);
        Media baseParent = resolveParent(parentId, businessId);
        Map<String, Media> foldersByPath = new HashMap<>();
        List<MediaResponse> uploadedMedia = new ArrayList<>(files.size());

        for (int index = 0; index < files.size(); index++) {
            List<String> path = uploadPaths.get(index);
            Media parent = baseParent;
            StringBuilder folderPath = new StringBuilder();

            for (int segmentIndex = 0; segmentIndex < path.size() - 1; segmentIndex++) {
                String folderName = path.get(segmentIndex);
                if (!folderPath.isEmpty()) {
                    folderPath.append('/');
                }
                folderPath.append(folderName);

                String pathKey = folderPath.toString();
                Media cachedFolder = foldersByPath.get(pathKey);
                if (cachedFolder == null) {
                    cachedFolder = findOrCreateFolder(folderName, parent, membership, businessId);
                    foldersByPath.put(pathKey, cachedFolder);
                }
                parent = cachedFolder;
            }

            uploadedMedia.add(upload(files.get(index), filenames.get(index), parent, membership));
        }

        return uploadedMedia;
    }

    private MediaResponse upload(MultipartFile file, String filename, Media parent, BusinessUser membership) {
        String storageKey = minioStorageClient.upload(file);
        Media media = mediaMapper.toEntity(
                membership.getBusiness(),
                membership.getUser(),
                parent,
                storageKey,
                filename,
                file.getSize(),
                StringUtils.hasText(file.getContentType())
                        ? file.getContentType()
                        : "application/octet-stream",
                extractExtension(filename));
        return mediaMapper.toDto(mediaRepository.save(media));
    }

    private Media findOrCreateFolder(
            String name,
            Media parent,
            BusinessUser membership,
            String businessId) {
        Optional<Media> existingFolder = parent == null
                ? mediaRepository.findFirstByBusinessIdAndParentIsNullAndNameAndTypeAndStatus(
                        businessId,
                        name,
                        MediaType.FOLDER,
                        MediaStatus.ACTIVE)
                : mediaRepository.findFirstByBusinessIdAndParentIdAndNameAndTypeAndStatus(
                        businessId,
                        parent.getId(),
                        name,
                        MediaType.FOLDER,
                        MediaStatus.ACTIVE);

        return existingFolder.orElseGet(() -> mediaRepository.save(Media.builder()
                .business(membership.getBusiness())
                .owner(membership.getUser())
                .storageKey("folders/" + CUIDGenerator.createId())
                .name(name)
                .type(MediaType.FOLDER)
                .parent(parent)
                .size(null)
                .mimeType(FOLDER_MIME_TYPE)
                .extension("")
                .status(MediaStatus.ACTIVE)
                .build()));
    }

    private Media resolveParent(String parentId, String businessId) {
        if (!StringUtils.hasText(parentId)) {
            return null;
        }

        return mediaRepository.findFirstByIdAndBusinessIdAndTypeAndStatus(
                parentId.trim(),
                businessId,
                MediaType.FOLDER,
                MediaStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
    }

    private List<List<String>> normalizeUploadPaths(List<String> filenames, List<String> paths) {
        if (paths != null && !paths.isEmpty() && paths.size() != filenames.size()) {
            throw new IllegalArgumentException("A relative path is required for every file");
        }

        List<List<String>> normalizedPaths = new ArrayList<>(filenames.size());
        for (int index = 0; index < filenames.size(); index++) {
            String filename = filenames.get(index);
            String relativePath = paths == null || paths.isEmpty() ? filename : paths.get(index);
            normalizedPaths.add(normalizeUploadPath(relativePath, filename));
        }
        return normalizedPaths;
    }

    private List<String> normalizeUploadPath(String relativePath, String filename) {
        if (!StringUtils.hasText(relativePath)) {
            throw new IllegalArgumentException("Relative paths must not be blank");
        }

        String normalizedPath = relativePath.replace('\\', '/');
        while (normalizedPath.startsWith("/")) {
            normalizedPath = normalizedPath.substring(1);
        }
        if (normalizedPath.length() > MAX_RELATIVE_PATH_LENGTH) {
            throw new IllegalArgumentException("Relative paths must not exceed 4096 characters");
        }

        String[] rawSegments = normalizedPath.split("/", -1);
        List<String> segments = new ArrayList<>(rawSegments.length);
        for (String segment : rawSegments) {
            validatePathSegment(segment);
            segments.add(segment);
        }
        if (!segments.getLast().equals(filename)) {
            throw new IllegalArgumentException("Relative path file names must match uploaded file names");
        }
        return List.copyOf(segments);
    }

    private void validatePathSegment(String segment) {
        if (!StringUtils.hasText(segment)
                || segment.equals(".")
                || segment.equals("..")
                || segment.indexOf('\r') >= 0
                || segment.indexOf('\n') >= 0
                || segment.indexOf('\0') >= 0) {
            throw new IllegalArgumentException("Relative path is invalid");
        }
        if (segment.length() > MAX_FILENAME_LENGTH) {
            throw new IllegalArgumentException("Folder and file names must not exceed 255 characters");
        }
    }

    public PresignedUploadResponse createPresignedUploadUrl(String originalFilename, String businessId, String userId) {
        getActiveMembership(userId, businessId);
        String filename = extractFilename(originalFilename);
        String storageKey = minioStorageClient.generateObjectKey(filename);
        String uploadUrl = minioStorageClient.createPresignedUploadUrl(storageKey);
        return new PresignedUploadResponse(storageKey, uploadUrl);
    }

    public PresignedDownloadResponse createPresignedDownloadUrl(String mediaId, String businessId, String userId) {
        getActiveMembership(userId, businessId);
        Media media = mediaRepository.findFirstByIdAndBusinessIdAndStatus(
                mediaId,
                businessId,
                MediaStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
        String downloadUrl = minioStorageClient.createPresignedDownloadUrl(media.getStorageKey(), media.getName());
        return new PresignedDownloadResponse(downloadUrl);
    }

    public PresignedPreviewResponse createPresignedPreviewUrl(String mediaId, String businessId, String userId) {
        getActiveMembership(userId, businessId);
        Media media = mediaRepository.findFirstByIdAndBusinessIdAndStatus(
                mediaId,
                businessId,
                MediaStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));
        String previewUrl = minioStorageClient.createPresignedPreviewUrl(
                media.getStorageKey(),
                media.getName(),
                media.getMimeType());
        return new PresignedPreviewResponse(previewUrl);
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
