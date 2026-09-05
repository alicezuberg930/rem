package server.rem.dtos.file;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CloudinaryUploadResponse {
    @JsonProperty("original_filename")
    private String originalFilename;

    @JsonProperty("display_name")
    private String displayName;
    
    @JsonProperty("asset_folder")
    private String assetFolder;
    
    @JsonProperty("url")
    private String url;

    @JsonProperty("placeholder")
    private String placeholder;
    
    @JsonProperty("etag")
    private String etag;
    
    @JsonProperty("type")
    private String type;

    @JsonProperty("bytes")
    private Integer bytes;

    @JsonProperty("tags")
    private List<String> tags;

    @JsonProperty("created_at")
    private String created_at;
    
    @JsonProperty("format")
    private String format;

    @JsonProperty("height")
    private String height;
    
    @JsonProperty("width")
    private String width;

    @JsonProperty("signature")
    private String signature;

    @JsonProperty("version_id")
    private String versionId;

    @JsonProperty("asset_id")
    private String assetId;

    @JsonProperty("version")
    private String version;

    @JsonProperty("secure_url")
    private String secureUrl;

    @JsonProperty("public_id")
    private String publicId;

    @JsonProperty("resource_type")
    private String resourceType;
}
