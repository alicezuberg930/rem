package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.utils.mail.DynamicMail;
import server.rem.utils.mail.MailMessage;

@ExtendWith(MockitoExtension.class)
class EmailServiceTests {
    @Mock
    private DynamicMail dynamicMail;

    @Test
    void delegatesMessageToConfiguredBusinessMailStrategy() throws Exception {
        EmailService emailService = new EmailService(dynamicMail);

        emailService.sendMail("business-id", "user@example.com", "Subject", "<p>Body</p>");

        ArgumentCaptor<MailMessage> messageCaptor = ArgumentCaptor.forClass(MailMessage.class);
        verify(dynamicMail).send(org.mockito.ArgumentMatchers.eq("business-id"), messageCaptor.capture());
        MailMessage message = messageCaptor.getValue();
        assertEquals("user@example.com", message.getTo());
        assertEquals("Subject", message.getSubject());
        assertEquals("<p>Body</p>", message.getHtmlBody());
        assertNull(message.getAttachmentPath());
    }
}
