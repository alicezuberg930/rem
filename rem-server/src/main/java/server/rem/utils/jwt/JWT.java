package server.rem.utils.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import server.rem.enums.JWTAlgorithm;
import server.rem.utils.exceptions.UnauthorizedException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class JWT {

    private final String secret;
    private final JWTAlgorithm algorithm;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JWT(String secret, JWTAlgorithm algorithm) {
        this.secret = secret;
        this.algorithm = algorithm;
    }

    public JWT(String secret) {
        this(secret, JWTAlgorithm.HS256);
    }

    public String sign(Map<String, Object> payloadClaims, JWTOptions options) throws Exception {
        // Build header
        Map<String, Object> header = new HashMap<>();
        header.put("alg", algorithm.name());
        header.put("typ", "JWT");
        if (options.getHeaders() != null) {
            header.putAll(options.getHeaders());
        }
        // Build payload
        Map<String, Object> payload = new HashMap<>(payloadClaims);
        long now = System.currentTimeMillis() / 1000;
        payload.put("exp", now + options.getExpiresIn());
        if (options.getAudiences() != null) {
            payload.put("aud", options.getAudiences());
        }
        if (options.getSubject() != null) {
            payload.put("sub", options.getSubject());
        }
        if (options.getIssuer() != null) {
            payload.put("iss", options.getIssuer());
        }
        if (options.getJwtId() != null) {
            payload.put("jti", options.getJwtId());
        }
        if (options.getNotBefore() != null) {
            payload.put("nbf", options.getNotBefore().getTime() / 1000);
        }
        if (options.isIncludeIssuedTimestamp()) {
            payload.put("iat", now);
        }
        String headerPart = encodeBase64Url(objectMapper.writeValueAsBytes(header));
        String payloadPart = encodeBase64Url(objectMapper.writeValueAsBytes(payload));
        String data = headerPart + "." + payloadPart;
        String signaturePart = encodeBase64Url(signData(data.getBytes(StandardCharsets.UTF_8)));
        return data + "." + signaturePart;
    }

    public String sign(Map<String, Object> payloadClaims) throws Exception {
        return sign(payloadClaims, new JWTOptions());
    }

    public Map<String, Object> verify(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new UnauthorizedException("Invalid token format");
        }
        String headerPart = parts[0];
        String payloadPart = parts[1];
        String signaturePart = parts[2];
        // Verify signature
        String data = headerPart + "." + payloadPart;
        String expectedSignature = encodeBase64Url(signData(data.getBytes(StandardCharsets.UTF_8)));
        if (!expectedSignature.equals(signaturePart)) {
            throw new UnauthorizedException("Invalid token signature");
        }
        // Decode payload and header
        Map<String, Object> payload = objectMapper.readValue(decodeBase64Url(payloadPart), new TypeReference<Map<String, Object>>() {});
        Map<String, Object> header = objectMapper.readValue(decodeBase64Url(headerPart), new TypeReference<Map<String, Object>>() {});
        // Validate claims
        long currentTime = System.currentTimeMillis() / 1000;
        if (payload.containsKey("exp") && currentTime >= ((Number) payload.get("exp")).longValue()) {
            throw new UnauthorizedException("Token has expired");
        }
        if (payload.containsKey("nbf") && currentTime < ((Number) payload.get("nbf")).longValue()) {
            throw new UnauthorizedException("Token not valid yet");
        }

        // Merge header + payload (same as TS implementation)
        Map<String, Object> result = new HashMap<>(payload);
        result.putAll(header);
        return result;
    }

    private byte[] signData(byte[] data) throws Exception {
        Mac mac = Mac.getInstance(algorithm.getHmacAlgorithm());
        SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), algorithm.getHmacAlgorithm());
        mac.init(keySpec);
        return mac.doFinal(data);
    }

    private String encodeBase64Url(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    private byte[] decodeBase64Url(String data) {
        return Base64.getUrlDecoder().decode(data);
    }
}
