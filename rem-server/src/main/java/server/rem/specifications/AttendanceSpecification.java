package server.rem.specifications;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import server.rem.dtos.attendance.QueryAttendance;
import server.rem.entities.Attendance;

public class AttendanceSpecification {

    public static Specification<Attendance> withFilters(QueryAttendance dto, String userId) {
        return Specification
                .where(hasUserId(userId))
                .and(hasStartDate(dto.getStartDate()))
                .and(hasEndDate(dto.getEndDate()));
    }

    private static Specification<Attendance> hasUserId(String userId) {
        return (root, query, cb) -> userId == null ? null : cb.equal(root.get("user").get("id"), userId);
    }

    private static Specification<Attendance> hasStartDate(LocalDate startDate) {
        return (root, query, cb) -> startDate == null ? null : cb.greaterThanOrEqualTo(root.get("date"), startDate);
    }

    private static Specification<Attendance> hasEndDate(LocalDate endDate) {
        return (root, query, cb) -> endDate == null ? null : cb.lessThanOrEqualTo(root.get("date"), endDate);
    }
}
