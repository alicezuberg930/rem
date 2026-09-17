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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.enums.MediaPermissionType;

@Entity
@Table(
        name = "media_share_links",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_media_share_links_token",
                columnNames = "token"),
        indexes = {
                @Index(name = "idx_media_share_links_media_id", columnList = "media_id"),
                @Index(name = "idx_media_share_links_created_by_user_id", columnList = "created_by_user_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaShareLink extends Base {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id", nullable = false)
    private Media media;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @Column(name = "token", length = 255, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission", nullable = false)
    private MediaPermissionType permission;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
