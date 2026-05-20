package server.rem.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import server.rem.dtos.auth.*;
import server.rem.entities.*;
import server.rem.enums.JWTAlgorithm;
import server.rem.mappers.*;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.UserRepository;
import server.rem.utils.*;
import server.rem.utils.exceptions.*;
import server.rem.utils.messages.AuthMessages;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${jwt.access_token_secret}")
    private String accessTokenSecret;

    @Value("${jwt.refresh_token_secret}")
    private String refreshTokenSecret;

    @Value("${jwt.access_token_expiration}")
    private String accessTokenExpiration;

    @Value("${jwt.refresh_token_expiration}")
    private String refreshTokenExpiration;

    private final BusinessUserRepository businessUserRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AuthMapper authMapper;
    // private final EmailService emailService;

    public RoleResponse getCurrentRole(String userId, String businessId) {
        BusinessUser businessUser = businessUserRepository.findByUserIdAndBusinessId(userId, businessId)
                .orElseThrow(() -> new UnauthorizedException(AuthMessages.UNAUTHORIZED));
        return authMapper.toRoleResponse(businessUser.getRole());
    }

    public SignInResponse signIn(SignInRequest dto) throws Exception {
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS));

        boolean isMatch = passwordEncoder.matches(dto.getPassword(), user.getPassword());

        if (!isMatch) throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);

        // if password is correct we start signing access token and refresh token
        JWTOptions accessTokenOptions = new JWTOptions(Long.parseLong(accessTokenExpiration), "rem-app", true);
        JWTOptions refreshTokenOptions = new JWTOptions(Long.parseLong(refreshTokenExpiration), "rem-app", true);
        JWT accessTokenJwt = new JWT(accessTokenSecret, JWTAlgorithm.HS256);
        JWT refreshTokenJwt = new JWT(refreshTokenSecret, JWTAlgorithm.HS256);
        
        Map<String, Object> claims = Map.of("userId", user.getId());
        String accessToken = accessTokenJwt.sign(claims, accessTokenOptions);
        String refreshToken = refreshTokenJwt.sign(claims, refreshTokenOptions);
        return authMapper.toResponse(user, accessToken, refreshToken);
    }

    public UserProfileResponse signUp(SignUpRequest dto) {
        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // send email to user with verify token
        // ClassPathResource resource = new
        // ClassPathResource("templates/register-email.html");
        // String html = new String(resource.getInputStream().readAllBytes(),
        // StandardCharsets.UTF_8);
        // html = html.replace("{{fullname}}", user.getFullname());
        // html = html.replace("{{verifyToken}}", user.getVerifyToken());
        // html = html.replace("http://yourdomain.com", "https://yourrealdomain.com");
        // emailService.sendMail(businessId, user.getEmail(), "Verify your email",
        // html);
        return authMapper.toSummaryResponse(userRepository.save(user));
    }

    public UserProfileResponse profile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Your profile doesn't exist"));
        return authMapper.toSummaryResponse(user);
    }

    public String refreshAccessToken(String refreshToken) throws Exception {
        Map<String, Object> decoded = new JWT(refreshTokenSecret, JWTAlgorithm.HS256).verify(refreshToken);
        String accessToken = null;
        if(decoded.size() > 0) {
            JWTOptions options = new JWTOptions(Long.parseLong(accessTokenExpiration), "rem-app", true);
            JWT jwt = new JWT(accessTokenSecret, JWTAlgorithm.HS256);
            Map<String, Object> claims = Map.of("userId", decoded.get("userId"));
            accessToken = jwt.sign(claims, options);
        }
        return accessToken;
    }
}