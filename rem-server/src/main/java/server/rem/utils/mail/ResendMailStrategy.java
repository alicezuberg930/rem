package server.rem.utils.mail;

import java.io.File;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;

import com.resend.Resend;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

import lombok.RequiredArgsConstructor;
import server.rem.entities.Business;

@RequiredArgsConstructor
public class ResendMailStrategy implements MailStrategy {

    private final Business business;

    @Override
    public void send(MailMessage message) throws Exception {
        Resend resend = new Resend(business.getResendApiKey());
        CreateEmailOptions.Builder builder = CreateEmailOptions.builder()
                .from(String.format("%s <no-reply@%s>", business.getName(), business.getResendEmail()))
                .to(message.getTo())
                .subject(message.getSubject())
                .html(message.getHtmlBody());

        if (message.getAttachmentPath() != null && !message.getAttachmentPath().isBlank()) {
            File file = new File(message.getAttachmentPath());
            if (file.exists()) {
                byte[] fileBytes = Files.readAllBytes(file.toPath());
                String encoded = Base64.getEncoder().encodeToString(fileBytes);

                Attachment attachment = Attachment.builder()
                        // .path("attachmentPath")
                        .fileName(file.getName())
                        .content(encoded)
                        .build();

                builder.attachments(List.of(attachment));
            }
        }
        CreateEmailResponse data = resend.emails().send(builder.build());
        System.out.println(data.getId());
    }
}
