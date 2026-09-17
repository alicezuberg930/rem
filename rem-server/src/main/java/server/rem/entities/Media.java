package server.rem.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.MediaStatus;
import server.rem.enums.MediaType;

@Entity
@Table(
        name = "medias",
        indexes = {
                @Index(name = "idx_medias_business_id", columnList = "business_id"),
                @Index(name = "idx_medias_owner_id", columnList = "owner_id"),
                @Index(name = "idx_medias_parent_id", columnList = "parent_id"),
                @Index(name = "idx_medias_type", columnList = "type"),
                @Index(name = "idx_medias_status", columnList = "status"),
                @Index(name = "idx_medias_created_at", columnList = "created_at")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media extends Base {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "storage_key", length = 1024, nullable = false)
    private String storageKey;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private MediaType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Media parent;

    @Column(name = "size")
    private Long size;

    @Column(name = "mime_type", length = 255, nullable = false)
    private String mimeType;

    @Column(name = "extension", length = 255, nullable = false)
    private String extension;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MediaStatus status;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
