package server.rem.utils;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class CUIDGenerator {

    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom random = new SecureRandom();

    private static char randomLetter() {
        int idx = random.nextInt(ALPHABET.length());
        return ALPHABET.charAt(idx);
    }

    private static String createEntropy() {
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        String base64 = Base64.getEncoder().encodeToString(bytes);
        return base64.replaceAll("[^a-zA-Z0-9]", "").substring(0, Math.min(24, base64.length()));
    }

    private static String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA3-512");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return new BigInteger(1, hashBytes).toString(36);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public static String createId() {
        String time = Long.toString(System.currentTimeMillis(), 36);
        String salt = createEntropy();
        String hashInput = time + salt;
        String hashed = hash(hashInput);
        return randomLetter() + hashed.substring(1, 24);
    }
}
