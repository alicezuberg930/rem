package server.rem.common.messages;

public class AuthMessages {
    public static String INVALID_CREDENTIALS = "Invalid credentials";
    public static String ACCESS_DENIED = "Access Denied";
    public static String UNAUTHORIZED = "User is not authorized to view this business";
    public static String EMAIL_EXISTS = "Email already existed";
    public static String LOGOUT_SUCCESS = "Logged out successfully";

    public static String SIGN_IN_SUCCESS(String name) {
        return "Welcome back, %s!".formatted(name);
    }

    public static String SIGN_UP_SUCCESS(String name) {
        return "Sign up successful, %s!, Confirm your identity and sign in".formatted(name);
    }
}
