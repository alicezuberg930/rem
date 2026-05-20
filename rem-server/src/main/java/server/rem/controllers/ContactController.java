package server.rem.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import server.rem.dtos.APIResponse;
import server.rem.dtos.CustomPageResponse; 
import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.contact.CreateContactRequest;
import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Contact;
import server.rem.services.ContactService;
import server.rem.views.Views;
 
@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;
 
    @GetMapping
    // @PreAuthorize("hasAuthority('contact.read')")
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