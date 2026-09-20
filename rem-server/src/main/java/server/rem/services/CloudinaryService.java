package server.rem.services;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.file.CloudinaryUploadResponse;
import server.rem.utils.CUIDGenerator;

@Component
@RequiredArgsConstructor
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    @Value("${cloudinary.api-key}")
    private String apiKey;
    @Value("${cloudinary.api-secret}")
    private String apiSecret;
    @Value("${cloudinary.base-folder}")
    private String baseFolder;

    private final ObjectMapper objectMapper;

    public List<String> uploadFiles(List<MultipartFile> files, String subFolder, String publicId) throws Exception {
        validateCredentials();
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            String url = uploadSingleFile(file, subFolder, publicId);
            urls.add(url);
        }
        return urls;
    }

    public String uploadFile(MultipartFile file, String subFolder, String publicId) throws Exception {
        validateCredentials();
        return uploadSingleFile(file, subFolder, publicId);
    }

    private String uploadSingleFile(MultipartFile file, String subFolder, String publicId) throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String folder = subFolder != null ? baseFolder + subFolder : null;
        String finalPubId = publicId != null ? publicId : CUIDGenerator.createId();

        // Build signature params (must be sorted)
        Map<String, String> signatureParams = new TreeMap<>();
        signatureParams.put("timestamp", timestamp);
        signatureParams.put("public_id", finalPubId);
        signatureParams.put("overwrite", "true");
        signatureParams.put("invalidate", "true");
        signatureParams.put("use_filename", "false");
        signatureParams.put("unique_filename", "false");
        if (folder != null) {
            signatureParams.put("folder", folder);
        }

        String signature = generateSignature(signatureParams, apiSecret);

        // Build multipart body
        HttpClient client = HttpClient.newHttpClient();

        String boundary = "----FormBoundary" + System.currentTimeMillis();
        byte[] fileBytes = file.getBytes();
        String originalFilename = file.getOriginalFilename();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // file part
        baos.write(("--" + boundary + "\r\n").getBytes());
        baos.write(("Content-Disposition: form-data; name=\"file\"; filename=\"" + originalFilename + "\"\r\n").getBytes());
        baos.write(("Content-Type: " + file.getContentType() + "\r\n\r\n").getBytes());
        baos.write(fileBytes);
        baos.write("\r\n".getBytes());
        // other fields
        Map<String, String> formFields = new LinkedHashMap<>();
        formFields.put("api_key", apiKey);
        formFields.put("timestamp", timestamp);
        formFields.put("signature", signature);
        formFields.put("public_id", finalPubId);
        formFields.put("overwrite", "true");
        formFields.put("invalidate", "true");
        formFields.put("use_filename", "false");
        formFields.put("unique_filename", "false");
        if (folder != null) {
            formFields.put("folder", folder);
        }

        for (Map.Entry<String, String> entry : formFields.entrySet()) {
            baos.write(("--" + boundary + "\r\n").getBytes());
            baos.write(("Content-Disposition: form-data; name=\"" + entry.getKey() + "\"\r\n\r\n").getBytes());
            baos.write((entry.getValue() + "\r\n").getBytes());
        }
        baos.write(("--" + boundary + "--\r\n").getBytes());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/auto/upload"))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            JsonNode error = objectMapper.readTree(response.body());
            String message = error.path("error").path("message").asText("Upload failed");
            throw new Exception(message);
        }

        CloudinaryUploadResponse result = objectMapper.readValue(response.body(), CloudinaryUploadResponse.class);
        return result.getSecureUrl();
    }

    public void deleteFiles(List<String> fileUrls) throws Exception {
        validateCredentials();
        for (String url : fileUrls) {
            deleteSingleFile(url);
        }
    }

    public void deleteFile(String fileUrl) throws Exception {
        validateCredentials();
        deleteSingleFile(fileUrl);
    }

    private void deleteSingleFile(String fileUrl) throws Exception {
        String publicId = extractPublicId(fileUrl);
        String resourceType = getResourceType(fileUrl);
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);

        Map<String, String> signatureParams = new TreeMap<>();
        signatureParams.put("public_id", publicId);
        signatureParams.put("timestamp", timestamp);

        String signature = generateSignature(signatureParams, apiSecret);

        String boundary = "----FormBoundary" + System.currentTimeMillis();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Map<String, String> formFields = new LinkedHashMap<>();
        formFields.put("public_id", publicId);
        formFields.put("api_key", apiKey);
        formFields.put("timestamp", timestamp);
        formFields.put("signature", signature);

        for (Map.Entry<String, String> entry : formFields.entrySet()) {
            baos.write(("--" + boundary + "\r\n").getBytes());
            baos.write(("Content-Disposition: form-data; name=\"" + entry.getKey() + "\"\r\n\r\n").getBytes());
            baos.write((entry.getValue() + "\r\n").getBytes());
        }
        baos.write(("--" + boundary + "--\r\n").getBytes());

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/" + resourceType + "/destroy"))
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(HttpRequest.BodyPublishers.ofByteArray(baos.toByteArray()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            JsonNode error = objectMapper.readTree(response.body());
            String message = error.path("error").path("message").asText("Delete failed");
            throw new Exception(message);
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private String generateSignature(Map<String, String> params, String apiSecret) throws Exception {
        String paramString = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        byte[] hash = digest.digest((paramString + apiSecret).getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    public String extractPublicId(String url) {
        String[] parts = url.split("/");
        int uploadIndex = -1;
        for (int i = 0; i < parts.length; i++) {
            if (parts[i].equals("upload")) {
                uploadIndex = i;
                break;
            }
        }
        if (uploadIndex == -1) {
            return "";
        }

        String publicIdWithExt = String.join("/", Arrays.copyOfRange(parts, uploadIndex + 1, parts.length));

        // Remove version prefix (e.g v1234567/)
        if (publicIdWithExt.matches("^v\\d+/.*")) {
            publicIdWithExt = publicIdWithExt.replaceFirst("^v\\d+/", "");
        }

        // Remove file extension
        return publicIdWithExt.replaceFirst("\\.[^/.]+$", "");
    }

    private String getResourceType(String url) {
        String extension = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (List.of("mp3", "wav", "ogg", "flac", "m4a", "aac").contains(extension)) {
            return "video";
        }
        if (List.of("jpg", "jpeg", "png", "gif", "webp", "svg", "bmp").contains(extension)) {
            return "image";
        }
        return "raw";
    }

    private void validateCredentials() {
        if (cloudName == null || apiKey == null || apiSecret == null) {
            throw new IllegalArgumentException("Cloudinary credentials missing");
        }
    }
}
