package server.rem.controllers;

import java.time.LocalDate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.contact.CreateContactRequest;
import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Contact;
import server.rem.services.ContactService;
 
@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;
 
    @GetMapping
    @PreAuthorize("hasAuthority('contact.read')")
    public ResponseEntity<APIResponse<CustomPageResponse<ContactResponse>>> getAll(
        @ModelAttribute QueryContact dto, 
        @RequestAttribute("businessId") String businessId
    ) {
        return ResponseEntity.ok(
            APIResponse.success(
                200, 
                "Contact list fetched successfully", 
                contactService.getAll(dto, businessId)
            )
        );
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('contact.read')")
    public ResponseEntity<StreamingResponseBody> export(
        @ModelAttribute QueryContact dto,
        @RequestAttribute("businessId") String businessId
    ) {
        String filename = "customers-" + LocalDate.now() + ".xlsx";
        StreamingResponseBody body = outputStream -> contactService.writeExcel(dto, businessId, outputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(body);
    }
 
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('contact.read')")
    public ResponseEntity<APIResponse<Contact>> getOne(@PathVariable String id) {
        return ResponseEntity.ok(APIResponse.success(200, "Contact fetched", contactService.getOne(id)));
    }
 
    @PostMapping
    // @PreAuthorize("hasAuthority('contact.create')")
    public ResponseEntity<APIResponse<Contact>> create(@Valid @RequestBody CreateContactRequest dto) {
        return ResponseEntity.ok(APIResponse.success(201, "Contact created", contactService.create(dto)));
    }
 
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('contact.edit')")
    public ResponseEntity<APIResponse<Contact>> update(@PathVariable String id, @Valid @RequestBody CreateContactRequest dto) {
        return ResponseEntity.ok(APIResponse.success(200, "Contact updated", contactService.update(id, dto)));
    }
 
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('contact.delete')")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable String id) {
        contactService.delete(id);
        return ResponseEntity.ok(APIResponse.success(200, "Contact deleted", null));
    }
}
