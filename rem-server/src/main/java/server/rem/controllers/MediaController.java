package server.rem.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.media.MediaResponse;
import server.rem.dtos.media.PresignedDownloadResponse;
import server.rem.dtos.media.PresignedPreviewResponse;
import server.rem.dtos.media.PresignedUploadResponse;
import server.rem.dtos.media.QueryMedia;
import server.rem.services.MediaService;

@RestController
@RequestMapping("/medias")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<APIResponse<CustomPageResponse<MediaResponse>>> getAll(
            @ModelAttribute QueryMedia query,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Media fetched",
                mediaService.getAll(query, businessId, userId)));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<List<MediaResponse>>> upload(
            @RequestPart("files") List<MultipartFile> files,
            @RequestParam(value = "paths", required = false) List<String> paths,
            @RequestParam(value = "parentId", required = false) String parentId,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                201,
                "Media uploaded",
                mediaService.upload(files, paths, parentId, businessId, userId)));
    }

    @GetMapping("/upload/presigned")
    public ResponseEntity<APIResponse<PresignedUploadResponse>> createPresignedUploadUrl(
            @RequestParam String filename,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Presigned upload URL created",
                mediaService.createPresignedUploadUrl(filename, businessId, userId)));
    }

    @GetMapping("/download/{mediaId}")
    public ResponseEntity<APIResponse<PresignedDownloadResponse>> createPresignedDownloadUrl(
            @RequestAttribute("businessId") String businessId,
            @PathVariable String mediaId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Presigned download URL created",
                mediaService.createPresignedDownloadUrl(mediaId, businessId, userId)));
    }

    @GetMapping("/preview/{mediaId}")
    public ResponseEntity<APIResponse<PresignedPreviewResponse>> createPresignedPreviewUrl(
            @RequestAttribute("businessId") String businessId,
            @PathVariable String mediaId,
            @RequestUser String userId) {
        return ResponseEntity.ok(APIResponse.success(
                200,
                "Presigned preview URL created",
                mediaService.createPresignedPreviewUrl(mediaId, businessId, userId)));
    }

    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> delete(
            @RequestBody List<String> mediaIds,
            @RequestAttribute("businessId") String businessId,
            @RequestUser String userId) {
        mediaService.delete(mediaIds, businessId, userId);
        return ResponseEntity.ok(APIResponse.success(200, "Media deleted", null));
    }
}
