package server.rem.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
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
import server.rem.utils.CUIDGenerator;

@Entity
@Table(
        name = "push_notifications",
        indexes = @Index(name = "push_notifications_user_id_idx", columnList = "user_id"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushNotification {
    @Id
    @Column(name = "id", nullable = false, length = 24)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "endpoint", nullable = false, columnDefinition = "TEXT")
    private String endpoint;

    @Column(name = "p256dh", nullable = false, length = 255)
    private String p256dh;

    @Column(name = "auth", nullable = false, length = 255)
    private String auth;

    @Column(name = "ip", length = 45)
    private String ip;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "browser", length = 255)
    private String browser;

    @Column(name = "device_type", length = 255)
    private String deviceType;

    @Column(name = "device_vendor", length = 255)
    private String deviceVendor;

    @Column(name = "device_model", length = 255)
    private String deviceModel;

    @Column(name = "cpu", length = 255)
    private String cpu;

    @Column(name = "os", length = 255)
    private String os;

    @PrePersist
    private void initialize() {
        if (id == null) {
            id = CUIDGenerator.createId();
        }
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }
}
