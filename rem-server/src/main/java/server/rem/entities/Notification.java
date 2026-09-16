package server.rem.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(name = "notifications_business_id_idx", columnList = "business_id"),
                @Index(name = "notifications_to_user_id_idx", columnList = "to_user_id"),
                @Index(name = "notifications_unique_key_idx", columnList = "unique_key")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends Base {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "time", nullable = false)
    private LocalDateTime time;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Column(name = "unique_key", length = 255)
    private String uniqueKey;

    @PrePersist
    private void initializeTime() {
        if (time == null) {
            time = LocalDateTime.now();
        }
    }
}
