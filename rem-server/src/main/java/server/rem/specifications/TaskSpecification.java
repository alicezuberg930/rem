package server.rem.specifications;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.JoinType;
import server.rem.dtos.tasks.QueryTask;
import server.rem.entities.Task;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;

public class TaskSpecification {

    public static Specification<Task> withFilters(QueryTask dto, String businessId) {
        return Specification
                .where(hasBusinessId(businessId))
                .and(hasStatus(dto.getStatus()))
                .and(hasPriority(dto.getPriority()))
                .and(matchesFilter(dto.getFilter()));
    }

    private static Specification<Task> hasBusinessId(String businessId) {
        return (root, query, cb) -> cb.equal(root.get("business").get("id"), businessId);
    }

    private static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    private static Specification<Task> hasPriority(TaskPriority priority) {
        return (root, query, cb) -> priority == null ? null : cb.equal(root.get("priority"), priority);
    }

    private static Specification<Task> matchesFilter(String filter) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(filter)) {
                return null;
            }
            String keyword = "%" + filter.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.join("assignee", JoinType.LEFT).get("fullname")), keyword)
            );
        };
    }
}
