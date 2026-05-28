package server.rem.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server.rem.dtos.APIResponse;

@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping()
    public ResponseEntity<APIResponse<Void>> check() {
        return ResponseEntity.ok().body(APIResponse.success(
            200,
            "App healthy",
            null
        ));
    }
}
