package server.rem.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.QueryPaginate;
import server.rem.dtos.payroll.CreatePayrollPeriodRequest;
import server.rem.dtos.payroll.PayrollItemResponse;
import server.rem.entities.PayrollItem;
import server.rem.entities.PayrollPeriod;
import server.rem.services.PayrollService;

@RestController
@RequestMapping("/payrolls")
@RequiredArgsConstructor
public class PayrollController {
    private final PayrollService payrollService;

    @GetMapping("/items")
    public ResponseEntity<APIResponse<CustomPageResponse<PayrollItemResponse>>> getItems(
            @ModelAttribute QueryPaginate dto,
            @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Payroll items fetched successfully",
            payrollService.getItems(businessId, dto)
        ));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('payroll.export')")
    public ResponseEntity<StreamingResponseBody> export(@RequestAttribute("businessId") String businessId) {
        String filename = "payroll-" + LocalDate.now() + ".xlsx";
        StreamingResponseBody body = outputStream -> payrollService.writeExcel(businessId, outputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(body);
    }

    @PostMapping("/period")
    public ResponseEntity<APIResponse<PayrollPeriod>> createPeriod(@Valid @RequestBody CreatePayrollPeriodRequest dto) {
        return ResponseEntity.status(201).body(APIResponse.success(
            201,
            "Payroll period created successfully",
            payrollService.createPeriod(dto)
        ));
    }

    @PostMapping("/period/{periodId}/generate")
    public ResponseEntity<APIResponse<List<PayrollItem>>> generateAllEmployeePayroll(@PathVariable String periodId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Payroll for this period generated sucessfully",
            payrollService.generateAllEmployeePayroll(periodId)
        ));
    }

    @PutMapping("/period/{periodId}/submit")
    public ResponseEntity<APIResponse<PayrollPeriod>> submitPayrollPeriod(@PathVariable String periodId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Payroll submitted sucessfully",
            payrollService.submitPayrollPeriod(periodId)
        ));
    }

    @PutMapping("/period/{periodId}/approve")
    public ResponseEntity<APIResponse<PayrollPeriod>> approvePayrollPeriod(@PathVariable String periodId, @RequestUser String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Payroll period approved sucessfully",
            payrollService.approvePayrollPeriod(periodId, userId)
        ));
    }


    @PutMapping("/period/{periodId}/pay")
    public ResponseEntity<APIResponse<PayrollPeriod>> markAsPaid(@PathVariable String periodId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Payroll marked as paid",
            payrollService.markAsPaid(periodId)
        ));
    }

    @GetMapping("/period/{periodId}/item/{userId}")
    public ResponseEntity<APIResponse<PayrollItem>> getEmployeePayslip(@PathVariable String periodId, @PathVariable String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "Employee payslip fetched successfully",
            payrollService.getEmployeePayslip(periodId, userId)
        ));
    }
}
