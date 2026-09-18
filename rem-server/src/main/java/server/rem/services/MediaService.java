package server.rem.services;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.media.MediaDto;
import server.rem.entities.BusinessUser;
import server.rem.entities.Media;
import server.rem.mappers.MediaMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.MediaRepository;
import server.rem.utils.MinioStorageClient;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final int MAX_FILENAME_LENGTH = 255;

    private final MediaRepository mediaRepository;
    private final BusinessUserRepository businessUserRepository;
    private final MinioStorageClient minioStorageClient;
    private final MediaMapper mediaMapper;

    public MediaDto upload(MultipartFile file, String businessId, String userId) {
        String filename = extractFilename(file);
        BusinessUser membership = businessUserRepository.findActiveByUserIdAndBusinessId(userId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Active business user not found"));
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

    private String extractFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty file is required");
        }

        String path = StringUtils.cleanPath(
                StringUtils.hasText(file.getOriginalFilename()) ? file.getOriginalFilename() : "")
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

    private String extractExtension(String filename) {
        int extensionStart = filename.lastIndexOf('.');
        return extensionStart > 0 && extensionStart < filename.length() - 1
                ? filename.substring(extensionStart + 1)
                : "";
    }
}
