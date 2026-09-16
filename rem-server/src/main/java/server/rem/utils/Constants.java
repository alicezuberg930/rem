package server.rem.utils;

public class Constants {
    public static String accessTokenCookieKey = "X-Access-Token";
    public static String refreshTokenCookieKey = "X-Refresh-Token";
    public static String businessIdCookieKey = "X-Business-Id";
    public static String accessTokenHeaderKey = "X-Access-Token-Expiration";
    public static double SOCIAL_INSURANCE_RATE = 0.08; // 8%
    public static double HEALTH_INSURANCE_RATE = 0.015; // 1.5%
    public static double UNEMPLOYMENT_INSURANCE_RATE = 0.01; // 1%
    public static int FAMILY_CIRCUMSTANCE_DEDUCTION = 6200000;
    public static int SELF_CIRCUMSTANCE_DEDUCTION = 15500000;
}
