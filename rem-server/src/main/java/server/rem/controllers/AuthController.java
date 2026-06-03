package server.rem.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.annotation.JsonView;

import server.rem.annotations.RequestUser;
import server.rem.dtos.APIResponse;
import server.rem.dtos.auth.*;
import server.rem.interceptors.BusinessContextFilter;
import server.rem.services.AuthService;
import server.rem.utils.Constants;
import server.rem.utils.messages.AuthMessages;
import server.rem.views.Views;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Value("${jwt.access_token_expiration}")
    private String accessTokenExpiration;

    @Value("${jwt.refresh_token_expiration}")
    private String refreshTokenExpiration;

    @PostMapping("/sign-in")
    public ResponseEntity<APIResponse<SignInResponse>> signIn(@Valid @RequestBody SignInRequest dto) throws Exception {
        SignInResponse signInResponse = authService.signIn(dto);
        
        // Calculate access token expiration timestamp (seconds)
        long accessTokenExpSeconds = Long.parseLong(accessTokenExpiration);
        
        ResponseCookie accessToken = ResponseCookie
                .from(Constants.accessTokenCookieKey, signInResponse.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                .sameSite("None")
                .build();

        ResponseCookie refreshToken = ResponseCookie
                .from(Constants.refreshTokenCookieKey, signInResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(Long.parseLong(refreshTokenExpiration)))
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessToken.toString())
                .header(HttpHeaders.SET_COOKIE, refreshToken.toString())
                .body(APIResponse.success(
                        200,
                        AuthMessages.SIGN_IN_SUCCESS(signInResponse.getUser().getFullname()),
                        signInResponse)
                );
    }

    @PostMapping("/sign-up")
    public ResponseEntity<APIResponse<UserProfileResponse>> signUp(@Valid @RequestBody SignUpRequest dto) {
        UserProfileResponse user = authService.signUp(dto);
        return ResponseEntity.status(201).body(APIResponse.success(
                201,
                AuthMessages.SIGN_UP_SUCCESS(user.getFullname()),
                user));
    }

    @JsonView(Views.Public.class)
    @GetMapping("/me")
    public ResponseEntity<APIResponse<UserProfileResponse>> profile(@RequestUser String userId) {
        return ResponseEntity.status(200).body(APIResponse.success(
                200,
                "Profile fetched successfully",
                authService.profile(userId)));
    }
    
    @JsonView(Views.Me.class)
    @GetMapping("/role")
    public ResponseEntity<APIResponse<RoleResponse>> getCurrentRole(@RequestUser String userId, @RequestAttribute("businessId") String businessId) {
        return ResponseEntity.status(200).body(APIResponse.success(
                200,
                "Role fetched successfully",
                authService.getCurrentRole(userId, businessId))
        );
    }

    @PostMapping("/sign-out")
    public ResponseEntity<APIResponse<Void>> signOut(@RequestUser String userId) {
        ResponseCookie removeAccessToken = ResponseCookie.from(Constants.accessTokenCookieKey, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        
        ResponseCookie removeRefreshToken = ResponseCookie.from(Constants.refreshTokenCookieKey, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        BusinessContextFilter.clearUserCache(userId);
        
        return ResponseEntity.status(200)
                .header(HttpHeaders.SET_COOKIE, removeAccessToken.toString())
                .header(HttpHeaders.SET_COOKIE, removeRefreshToken.toString())
                .body(APIResponse.success(
                        200,
                        AuthMessages.SIGN_OUT_SUCCESS,
                        null
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<APIResponse<RefreshResponse>> refreshAccessToken(@RequestAttribute("refreshToken") String refreshToken) throws Exception {
        RefreshResponse response = authService.refreshAccessToken(refreshToken);
        
        long accessTokenExpSeconds = Long.parseLong(accessTokenExpiration);
        ResponseCookie accessTokenCookie = ResponseCookie
                .from(Constants.accessTokenCookieKey, response.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                .sameSite("None")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(Constants.accessTokenHeaderKey, String.valueOf(response.getAccessTokenExpiration()))
                .header("Access-Control-Expose-Headers", Constants.accessTokenHeaderKey)
                .body(APIResponse.success(
                        200,
                        AuthMessages.REFRESH_SUCCESS,
                        response
                )
        );
    }

}