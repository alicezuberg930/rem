package server.rem.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "ChatGroup")
@Table(name = "`groups`")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Group extends Base {
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "avatar", length = 255, nullable = false)
    private String avatar;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "group_user",
            joinColumns = @JoinColumn(name = "group_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "user_id", nullable = false),
            uniqueConstraints = @UniqueConstraint(
                    name = "uk_group_user_group_user",
                    columnNames = { "group_id", "user_id" }))
    @Builder.Default
    private Set<User> members = new LinkedHashSet<>();
}
