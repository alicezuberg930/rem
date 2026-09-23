package server.rem.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockConstruction;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Base64;

import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.junit.jupiter.api.Test;
import org.mockito.MockedConstruction;

import nl.martijndwars.webpush.Encoding;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import server.rem.entities.PushNotification;

class WebPushClientTests {
    @Test
    void startsWithoutVapidConfiguration() {
        assertFalse(new WebPushClient("", "", "").isConfigured());
    }

    @Test
    void sendsUsingAes128GcmEncoding() throws Exception {
        try (MockedConstruction<PushService> construction = mockConstruction(PushService.class)) {
            WebPushClient client = new WebPushClient("public-key", "private-key", "mailto:admin@example.com");
            PushService pushService = construction.constructed().getFirst();
            HttpResponse response = mock(HttpResponse.class);
            StatusLine statusLine = mock(StatusLine.class);
            when(response.getStatusLine()).thenReturn(statusLine);
            when(statusLine.getStatusCode()).thenReturn(201);
            when(pushService.send(any(Notification.class), eq(Encoding.AES128GCM))).thenReturn(response);

            int status = client.send(subscription(), "{\"title\":\"Test\"}");

            assertEquals(201, status);
            verify(pushService).send(any(Notification.class), eq(Encoding.AES128GCM));
        }
    }

    private PushNotification subscription() {
        return PushNotification.builder()
                .endpoint("https://push.example.com/subscription")
                .p256dh("BGgL7I82SAQM78oyGwaJdrQFhVfZqL9h4Y18BLtgJQ-9pSGXwxqAWQudqmcv41RcWgk1ssUeItv4-8khxbhYveM")
                .auth(Base64.getUrlEncoder().withoutPadding().encodeToString(new byte[16]))
                .build();
    }
}
