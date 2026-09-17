package server.rem.utils;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

class WebPushClientTests {
    @Test
    void startsWithoutVapidConfiguration() {
        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            context.register(WebPushClient.class);
            context.refresh();

            assertFalse(context.getBean(WebPushClient.class).isConfigured());
        }
    }
}
