package server.rem.controllers;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.business.*;
import server.rem.entities.*;
import server.rem.services.BusinessService;
import server.rem.utils.messages.BusinessMessages;
import server.rem.views.Views;

import java.util.List;

@RestController
@RequestMapping("/businesses")
@RequiredArgsConstructor
public class BusinessController {
    final private BusinessService businessService;

    @PostMapping
    public ResponseEntity<APIResponse<Business>> create(@RequestUser String userId, @Valid @RequestBody CreateBusinessRequest dto) {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                BusinessMessages.CREATED,
                businessService.create(userId, dto)
        ));
    }

    @JsonView(Views.Business.class)  
    @GetMapping
    public ResponseEntity<APIResponse<List<BusinessResponse>>> getAll(@Nullable @RequestUser String userId) {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                BusinessMessages.LIST_RETRIEVED,
                businessService.getAll(userId)
        ));
    }

    @PostMapping("/add")
    public ResponseEntity<APIResponse<User>> addToBusiness(
        @RequestUser String invitorId, 
        @Valid @RequestBody AddUserToBusinessRequest dto, 
        @RequestAttribute("businessId") String businessId
    ) {
        try {
            return ResponseEntity.ok().body(APIResponse.success(
                200,
                "User added to business successfully",
                businessService.addToBusiness(invitorId, dto, businessId)
            ));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/{businessId}")
    public ResponseEntity<APIResponse<Business>> update(@PathVariable String businessId, @RequestBody UpdateBusinessRequest dto) {
        return ResponseEntity.ok().body(APIResponse.success(
                200,
                "Business updated successfully",
                businessService.update(businessId, dto)
        ));
    }
}
