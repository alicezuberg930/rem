package server.rem.utils;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.concurrent.ExecutionException;

import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import server.rem.entities.PushNotification;

@Component
public class WebPushClient {
    private final PushService pushService;

    public WebPushClient(
            @Value("${notification.web-push-public-key}") String publicKey,
            @Value("${notification.web-pussh-private-key}") String privateKey,
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
            HttpResponse response = pushService.send(notification);
            return response.getStatusLine().getStatusCode();
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Web Push delivery interrupted", exception);
        } catch (GeneralSecurityException | IOException | JoseException | ExecutionException exception) {
            throw new IllegalStateException("Web Push delivery failed", exception);
        }
    }
}
