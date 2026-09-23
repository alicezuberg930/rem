package server.rem.utils;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.concurrent.ExecutionException;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Encoding;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import server.rem.entities.PushNotification;

@Component
@Slf4j
public class WebPushClient {
    private static final int MAX_ERROR_DETAILS_LENGTH = 500;

    private final PushService pushService;

    public WebPushClient(
            @Value("${notification.web-push-public-key}") String publicKey,
            @Value("${notification.web-push-private-key}") String privateKey,
            @Value("${notification.web-push-subject}") String subject) {
        boolean hasPublicKey = StringUtils.hasText(publicKey);
        boolean hasPrivateKey = StringUtils.hasText(privateKey);
        boolean hasSubject = StringUtils.hasText(subject);
        if (!hasPublicKey && !hasPrivateKey && !hasSubject) {
            pushService = null;
            return;
        }
        if (!hasPublicKey || !hasPrivateKey || !hasSubject) {
            throw new IllegalStateException(
                    "WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY, and WEB_PUSH_SUBJECT must be configured together");
        }
        try {
            if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            pushService = new PushService(publicKey, privateKey, subject);
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Invalid Web Push VAPID configuration", exception);
        }
    }

    public boolean isConfigured() {
        return pushService != null;
    }

    public int send(PushNotification subscription, String payload) {
        if (pushService == null) {
            throw new IllegalStateException("Web Push is not configured");
        }
        try {
            Notification notification = new Notification(
                    subscription.getEndpoint(),
                    subscription.getP256dh(),
                    subscription.getAuth(),
                    payload);
            HttpResponse response = pushService.send(notification, Encoding.AES128GCM);
            int status = response.getStatusLine().getStatusCode();
            String responseBody = response.getEntity() == null
                    ? null
                    : EntityUtils.toString(response.getEntity());
            if (status < 200 || status >= 300) {
                log.warn(
                        "Web Push provider returned status {}: {}",
                        status,
                        responseDetails(response, responseBody));
            }
            return status;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Web Push delivery interrupted", exception);
        } catch (GeneralSecurityException | IOException | JoseException | ExecutionException exception) {
            throw new IllegalStateException("Web Push delivery failed", exception);
        }
    }

    private String responseDetails(HttpResponse response, String responseBody) {
        String details = StringUtils.hasText(responseBody)
                ? responseBody.replaceAll("\\s+", " ").trim()
                : response.getStatusLine().getReasonPhrase();
        if (!StringUtils.hasText(details)) {
            return "No response details";
        }
        return details.length() <= MAX_ERROR_DETAILS_LENGTH
                ? details
                : details.substring(0, MAX_ERROR_DETAILS_LENGTH);
    }
}
