package server.rem.controllers;

import jakarta.servlet.http.HttpServletResponse;
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
import server.rem.services.AuthService;
import server.rem.utils.Constants;
import server.rem.utils.exceptions.UnauthorizedException;
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
    public ResponseEntity<APIResponse<SignInResponse>> signIn(@Valid @RequestBody SignInRequest dto, HttpServletResponse response) throws Exception {
        SignInResponse signInResponse = authService.signIn(dto);
        
        // Calculate access token expiration timestamp (seconds)
        long accessTokenExpSeconds = Long.parseLong(accessTokenExpiration);
        long accessTokenExpTimestamp = System.currentTimeMillis() / 1000 + accessTokenExpSeconds;
        
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

        // Non-HttpOnly cookie to expose access token expiration to JavaScript
        ResponseCookie accessTokenExp = ResponseCookie
                .from("accessTokenExp", String.valueOf(accessTokenExpTimestamp))
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessToken.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshToken.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenExp.toString());

        return ResponseEntity.ok().body(APIResponse.success(
                200,
                AuthMessages.SIGN_IN_SUCCESS(signInResponse.getUser().getFullname()),
                signInResponse));
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

    @PostMapping("/refresh")
    public ResponseEntity<APIResponse<String>> refreshAccessToken(@RequestAttribute("refreshToken") String refreshToken, HttpServletResponse response) throws Exception {
        String newToken = authService.refreshAccessToken(refreshToken);
        // Calculate access token expiration timestamp (seconds)
        long accessTokenExpSeconds = Long.parseLong(accessTokenExpiration);
        long accessTokenExpTimestamp = System.currentTimeMillis() / 1000 + accessTokenExpSeconds;
        
        ResponseCookie accessToken = ResponseCookie
                .from(Constants.accessTokenCookieKey, newToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                .sameSite("None")
                .build();

        // Non-HttpOnly cookie to expose access token expiration to JavaScript
        ResponseCookie accessTokenExp = ResponseCookie
                .from(Constants.accessTokenExp, String.valueOf(accessTokenExpTimestamp))
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessTokenExpSeconds))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessToken.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenExp.toString());

        return ResponseEntity.status(200).body(APIResponse.success(
            200,
            AuthMessages.REFRESH_SUCCESS,
            newToken
        ));
    }
}