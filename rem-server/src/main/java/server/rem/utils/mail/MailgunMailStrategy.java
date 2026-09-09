package server.rem.utils.mail;

import java.io.File;

import com.mailgun.api.v3.MailgunMessagesApi;
import com.mailgun.client.MailgunClient;
import com.mailgun.model.message.Message;
import com.mailgun.model.message.MessageResponse;

import lombok.RequiredArgsConstructor;
import server.rem.entities.Business;

@RequiredArgsConstructor
public class MailgunMailStrategy implements MailStrategy {

    private final Business business;

    @Override
    public void send(MailMessage mailMessage) throws Exception {
        MailgunMessagesApi api = MailgunClient.config(business.getMailgunApiKey()).createApi(MailgunMessagesApi.class);

        Message.MessageBuilder builder = Message.builder()
                .from(business.getMailgunUsername())
                .to(mailMessage.getTo())
                .subject(mailMessage.getSubject())
                .html(mailMessage.getHtmlBody());

        if (mailMessage.getAttachmentPath() != null && !mailMessage.getAttachmentPath().isBlank()) {
            File file = new File(mailMessage.getAttachmentPath());
            if (file.exists()) {
                builder.attachment(file);
            }
        }

        MessageResponse response = api.sendMessage(business.getMailgunDomain(), builder.build());
        if (response == null) {
            throw new RuntimeException("Mailgun: empty response");
        }
    }
}
