package server.rem.utils.mail;

import java.nio.file.Files;
import java.util.Base64;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import lombok.RequiredArgsConstructor;
import server.rem.entities.Business;

@RequiredArgsConstructor
public class SendGridMailStrategy implements MailStrategy {

    private final Business business;

    @Override
    public void send(MailMessage message) throws Exception {
        Email from = new Email(business.getSendGridUsername());
        Email to = new Email(message.getTo());
        Content content = new Content("text/html", message.getHtmlBody());
        Mail mail = new Mail(from, message.getSubject(), to, content);

        if (message.getAttachmentPath() != null && !message.getAttachmentPath().isBlank()) {
            java.io.File file = new java.io.File(message.getAttachmentPath());
            if (file.exists()) {
                Attachments attachment = new Attachments();
                attachment.setFilename(file.getName());
                attachment.setDisposition("attachment");
                attachment.setContent(Base64.getEncoder().encodeToString(Files.readAllBytes(file.toPath())));
                mail.addAttachments(attachment);
            }
        }

        SendGrid sg = new SendGrid(business.getSendGridApiKey());
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);
        if (response.getStatusCode() >= 400) {
            throw new RuntimeException("SendGrid error: " + response.getBody());
        }
    }
}
