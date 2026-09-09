package server.rem.utils.mail;

import java.io.File;
import java.util.Properties;

import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import server.rem.entities.Business;

@RequiredArgsConstructor
public class SmtpMailStrategy implements MailStrategy {

    private final Business business;

    @Override
    public void send(MailMessage message) throws Exception {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(business.getMailHost());
        sender.setPort(business.getMailPort());
        sender.setUsername(business.getMailUsername());
        sender.setPassword(business.getMailPassword());

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.starttls.enable", true);
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");

        MimeMessage mime = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mime, true);
        helper.setTo(message.getTo());
        helper.setSubject(message.getSubject());
        helper.setText(message.getHtmlBody(), true);

        if (message.getAttachmentPath() != null && !message.getAttachmentPath().isBlank()) {
            FileSystemResource file = new FileSystemResource(new File(message.getAttachmentPath()));
            if (file.exists()) {
                helper.addAttachment(file.getFilename(), file);
            }
        }

        sender.send(mime);
    }
}
