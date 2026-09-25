package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;

import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.media.QueryMedia;
import server.rem.dtos.media.MediaResponse;
import server.rem.dtos.media.PresignedPreviewResponse;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.Media;
import server.rem.entities.User;
import server.rem.enums.MediaStatus;
import server.rem.enums.MediaType;
import server.rem.mappers.MediaMapper;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.MediaPermissionRepository;
import server.rem.repositories.MediaRepository;
import server.rem.repositories.MediaShareLinkRepository;
import server.rem.utils.MinioStorageClient;

@ExtendWith(MockitoExtension.class)
class MediaServiceTests {
    private static final String BUSINESS_ID = "business-id";
    private static final String USER_ID = "user-id";

    @Mock
    private MediaRepository mediaRepository;
    @Mock
    private MediaPermissionRepository mediaPermissionRepository;
    @Mock
    private MediaShareLinkRepository mediaShareLinkRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private MinioStorageClient minioStorageClient;
    @Mock
    private MediaMapper mediaMapper;

    private MediaService mediaService;

    @BeforeEach
    void setUp() {
        mediaService = new MediaService(
                mediaRepository,
                mediaPermissionRepository,
                mediaShareLinkRepository,
                businessUserRepository,
                minioStorageClient,
                mediaMapper);
    }

    @Test
    void getAllReturnsBusinessScopedActiveMediaPageWithStableSort() {
        Media entity = new Media();
        MediaResponse response = new MediaResponse(
                "media-id",
                "storage-key",
                "photo.png",
                null,
                null,
                42L,
                "image/png",
                "png",
                MediaStatus.ACTIVE,
                null);
        PageRequest repositoryPage = PageRequest.of(1, 25);

        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(new BusinessUser()));
        when(mediaRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(entity), repositoryPage, 60));
        when(mediaMapper.toDto(entity)).thenReturn(response);

        CustomPageResponse<MediaResponse> result = mediaService.getAll(
                new QueryMedia(25, 1, null),
                BUSINESS_ID,
                USER_ID);

        assertEquals(List.of(response), result.getContent());
        assertEquals(1, result.getCurrentPage());
        assertEquals(3, result.getTotalPages());
        assertEquals(60, result.getTotalElements());
        assertEquals(25, result.getPageSize());
        assertTrue(result.isHasNext());
        assertEquals(0, result.getPreviousPage());
        assertEquals(2, result.getNextPage());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(mediaRepository).findAll(
                any(Specification.class),
                pageableCaptor.capture());
        Pageable pageable = pageableCaptor.getValue();
        assertEquals(1, pageable.getPageNumber());
        assertEquals(25, pageable.getPageSize());
        assertSame(Sort.Direction.DESC, pageable.getSort().getOrderFor("createdAt").getDirection());
        assertSame(Sort.Direction.DESC, pageable.getSort().getOrderFor("id").getDirection());
    }

    @Test
    void getAllClampsInvalidPaginationValues() {
        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(new BusinessUser()));
        when(mediaRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable pageable = invocation.getArgument(1);
                    return new PageImpl<Media>(List.of(), pageable, 0);
                });

        mediaService.getAll(new QueryMedia(0, -4, null), BUSINESS_ID, USER_ID);

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(mediaRepository).findAll(
                any(Specification.class),
                pageableCaptor.capture());
        assertEquals(0, pageableCaptor.getValue().getPageNumber());
        assertEquals(1, pageableCaptor.getValue().getPageSize());
    }

    @Test
    void getAllDefaultsNullPaginationValues() {
        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(new BusinessUser()));
        when(mediaRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable pageable = invocation.getArgument(1);
                    return new PageImpl<Media>(List.of(), pageable, 0);
                });
        QueryMedia query = new QueryMedia();
        query.setPage(null);
        query.setPageSize(null);

        mediaService.getAll(query, BUSINESS_ID, USER_ID);

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(mediaRepository).findAll(
                any(Specification.class),
                pageableCaptor.capture());
        assertEquals(0, pageableCaptor.getValue().getPageNumber());
        assertEquals(10, pageableCaptor.getValue().getPageSize());
    }

    @Test
    void uploadStoresEveryFileAndReturnsResponsesInRequestOrder() {
        MockMultipartFile firstFile = new MockMultipartFile(
                "files",
                "first.txt",
                "text/plain",
                "first".getBytes());
        MockMultipartFile secondFile = new MockMultipartFile(
                "files",
                "second.png",
                "image/png",
                "second".getBytes());
        Business business = new Business();
        User user = new User();
        BusinessUser membership = BusinessUser.builder()
                .business(business)
                .user(user)
                .build();
        Media firstMedia = new Media();
        Media secondMedia = new Media();
        MediaResponse firstResponse = new MediaResponse(
                "first-id",
                "first-key",
                "first.txt",
                MediaType.FILE,
                null,
                5L,
                "text/plain",
                "txt",
                MediaStatus.ACTIVE,
                null);
        MediaResponse secondResponse = new MediaResponse(
                "second-id",
                "second-key",
                "second.png",
                MediaType.FILE,
                null,
                6L,
                "image/png",
                "png",
                MediaStatus.ACTIVE,
                null);

        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership));
        when(minioStorageClient.upload(firstFile)).thenReturn("first-key");
        when(minioStorageClient.upload(secondFile)).thenReturn("second-key");
        when(mediaMapper.toEntity(
                business,
                user,
                null,
                "first-key",
                "first.txt",
                5L,
                "text/plain",
                "txt"))
                .thenReturn(firstMedia);
        when(mediaMapper.toEntity(
                business,
                user,
                null,
                "second-key",
                "second.png",
                6L,
                "image/png",
                "png"))
                .thenReturn(secondMedia);
        when(mediaRepository.save(firstMedia)).thenReturn(firstMedia);
        when(mediaRepository.save(secondMedia)).thenReturn(secondMedia);
        when(mediaMapper.toDto(firstMedia)).thenReturn(firstResponse);
        when(mediaMapper.toDto(secondMedia)).thenReturn(secondResponse);

        List<MediaResponse> result = mediaService.upload(
                List.of(firstFile, secondFile),
                null,
                null,
                BUSINESS_ID,
                USER_ID);

        assertEquals(List.of(firstResponse, secondResponse), result);
        verify(minioStorageClient).upload(firstFile);
        verify(minioStorageClient).upload(secondFile);
        verify(mediaRepository).save(firstMedia);
        verify(mediaRepository).save(secondMedia);
    }

    @Test
    void uploadRejectsAnEmptyFileList() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mediaService.upload(List.of(), null, null, BUSINESS_ID, USER_ID));

        assertEquals("At least one file is required", exception.getMessage());
    }

    @Test
    void uploadRecreatesFolderTreeAndParentsFiles() {
        MockMultipartFile document = new MockMultipartFile(
                "files",
                "document.txt",
                "text/plain",
                "document".getBytes());
        MockMultipartFile image = new MockMultipartFile(
                "files",
                "image.png",
                "image/png",
                "image".getBytes());
        Business business = new Business();
        User user = new User();
        BusinessUser membership = BusinessUser.builder()
                .business(business)
                .user(user)
                .build();

        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(membership));
        when(mediaRepository.findFirstByBusinessIdAndParentIsNullAndNameAndTypeAndStatus(
                BUSINESS_ID,
                "Project",
                MediaType.FOLDER,
                MediaStatus.ACTIVE))
                .thenReturn(Optional.empty());
        when(mediaRepository.findFirstByBusinessIdAndParentIdAndNameAndTypeAndStatus(
                any(), any(), any(), any(), any()))
                .thenReturn(Optional.empty());
        when(minioStorageClient.upload(document)).thenReturn("document-key");
        when(minioStorageClient.upload(image)).thenReturn("image-key");
        when(mediaMapper.toEntity(any(), any(), any(), any(), any(), anyLong(), any(), any()))
                .thenAnswer(invocation -> Media.builder()
                        .business(invocation.getArgument(0))
                        .owner(invocation.getArgument(1))
                        .parent(invocation.getArgument(2))
                        .storageKey(invocation.getArgument(3))
                        .name(invocation.getArgument(4))
                        .type(MediaType.FILE)
                        .size(invocation.getArgument(5))
                        .mimeType(invocation.getArgument(6))
                        .extension(invocation.getArgument(7))
                        .status(MediaStatus.ACTIVE)
                        .build());
        when(mediaRepository.save(any(Media.class))).thenAnswer(invocation -> {
            Media media = invocation.getArgument(0);
            media.generateId();
            return media;
        });

        mediaService.upload(
                List.of(document, image),
                List.of("Project/docs/document.txt", "Project/images/image.png"),
                null,
                BUSINESS_ID,
                USER_ID);

        ArgumentCaptor<Media> mediaCaptor = ArgumentCaptor.forClass(Media.class);
        verify(mediaRepository, times(5)).save(mediaCaptor.capture());
        List<Media> savedMedia = mediaCaptor.getAllValues();
        Media projectFolder = savedMedia.get(0);
        Media docsFolder = savedMedia.get(1);
        Media savedDocument = savedMedia.get(2);
        Media imagesFolder = savedMedia.get(3);
        Media savedImage = savedMedia.get(4);

        assertEquals(MediaType.FOLDER, projectFolder.getType());
        assertEquals("Project", projectFolder.getName());
        assertNull(projectFolder.getParent());
        assertEquals(MediaType.FOLDER, docsFolder.getType());
        assertSame(projectFolder, docsFolder.getParent());
        assertSame(docsFolder, savedDocument.getParent());
        assertEquals(MediaType.FOLDER, imagesFolder.getType());
        assertSame(projectFolder, imagesFolder.getParent());
        assertSame(imagesFolder, savedImage.getParent());
    }

    @Test
    void uploadRejectsTraversalInRelativePathsBeforeUploading() {
        MockMultipartFile file = new MockMultipartFile(
                "files",
                "document.txt",
                "text/plain",
                "document".getBytes());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mediaService.upload(
                        List.of(file),
                        List.of("../document.txt"),
                        null,
                        BUSINESS_ID,
                        USER_ID));

        assertEquals("Relative path is invalid", exception.getMessage());
    }

    @Test
    void createPresignedPreviewUrlUsesInlinePreviewUrlFromMinio() {
        Media media = Media.builder()
                .storageKey("object-key")
                .name("photo.png")
                .mimeType("image/png")
                .status(MediaStatus.ACTIVE)
                .build();

        when(businessUserRepository.findActiveByUserIdAndBusinessId(USER_ID, BUSINESS_ID))
                .thenReturn(Optional.of(new BusinessUser()));
        when(mediaRepository.findFirstByIdAndBusinessIdAndStatus("media-id", BUSINESS_ID, MediaStatus.ACTIVE))
                .thenReturn(Optional.of(media));
        when(minioStorageClient.createPresignedPreviewUrl("object-key", "photo.png", "image/png"))
                .thenReturn("https://minio.example/photo-preview");

        PresignedPreviewResponse result = mediaService.createPresignedPreviewUrl("media-id", BUSINESS_ID, USER_ID);

        assertEquals("https://minio.example/photo-preview", result.previewUrl());
        verify(minioStorageClient).createPresignedPreviewUrl("object-key", "photo.png", "image/png");
    }
}
