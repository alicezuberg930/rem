package server.rem.utils;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;

public class Utils {
    public static Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headers = new LinkedHashMap<>();
        request.getHeaderNames().asIterator()
                .forEachRemaining(name -> headers.put(name.toLowerCase(), request.getHeader(name)));
        return headers;
    }

    public static String detectDeviceType(String userAgent) {
        if (!StringUtils.hasText(userAgent))
            return null;
        String normalized = userAgent.toLowerCase(Locale.ROOT);
        if (normalized.contains("tablet") || normalized.contains("ipad"))
            return "tablet";
        if (normalized.contains("mobile") || normalized.contains("android") || normalized.contains("iphone"))
            return "mobile";
        return "desktop";
    }

    public static String detectOs(String userAgent) {
        if (!StringUtils.hasText(userAgent))
            return null;
        String normalized = userAgent.toLowerCase(Locale.ROOT);
        if (normalized.contains("windows"))
            return "Windows";
        if (normalized.contains("android"))
            return "Android";
        if (normalized.contains("iphone") || normalized.contains("ipad"))
            return "iOS";
        if (normalized.contains("mac os"))
            return "macOS";
        if (normalized.contains("linux"))
            return "Linux";
        return null;
    }

}
