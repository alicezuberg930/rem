package server.rem.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import server.rem.entities.Attendance;

@Component
public class WorkingDaysCalculator {

    // Calculate total working days in a period (exclude Sundays and holidays)
    public int calculateWorkingDays(LocalDate startDate, LocalDate endDate, List<LocalDate> holidays) {
        int workingDays = 0;
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            if (isWorkingDay(current, holidays)) {
                workingDays++;
            }
            current = current.plusDays(1);
        }
        return workingDays;
    }

    // Check if a date is a working day
    public boolean isWorkingDay(LocalDate date, List<LocalDate> holidays) {
        // Exclude Sundays
        if (date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return false;
        }
        // Exclude holidays
        return !(holidays != null && holidays.contains(date));
    }

    // Calculate actual days worked by employee
    public int calculateActualWorkedDays(LocalDate startDate, LocalDate endDate, List<LocalDate> holidays, List<Attendance> attendances) {
        Set<LocalDate> attendedDates = attendances.stream().map(Attendance::getDate).collect(Collectors.toSet());
        int workedDays = 0;
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            if (isWorkingDay(current, holidays) && attendedDates.contains(current)) {
                workedDays++;
            }
            current = current.plusDays(1);
        }
        return workedDays;
    }
}
