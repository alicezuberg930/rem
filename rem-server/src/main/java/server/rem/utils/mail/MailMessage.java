package server.rem.utils.mail;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MailMessage {

    private String to;
    private String subject;
    private String htmlBody;
    private String attachmentPath;
}
