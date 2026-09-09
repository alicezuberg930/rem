package server.rem.utils.mail;

public interface MailStrategy {

    void send(MailMessage message) throws Exception;
}
