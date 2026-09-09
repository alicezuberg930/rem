package server.rem.utils.mail;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import server.rem.entities.Business;
import server.rem.enums.MailProvider;
import server.rem.repositories.BusinessRepository;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Component
@RequiredArgsConstructor
public class DynamicMail {

    private final BusinessRepository businessRepository;
    private final Map<String, MailStrategy> cache = new ConcurrentHashMap<>();

    public MailStrategy create(Business business) {
        System.out.print("New strategy reset");
        return switch (business.getMailProvider()) {
            case MailProvider.SMTP ->
                new SmtpMailStrategy(business);
            case MailProvider.SENDGRID ->
                new SendGridMailStrategy(business);
            case MailProvider.MAILGUN ->
                new MailgunMailStrategy(business);
            case MailProvider.RESEND ->
                new ResendMailStrategy(business);
            case MailProvider.AMAZON_SES ->
                throw new UnsupportedOperationException("Unimplemented case: " + business.getMailProvider());
            case MailProvider.EXCHANGE ->
                throw new UnsupportedOperationException("Unimplemented case: " + business.getMailProvider());
            case MailProvider.OTHER ->
                throw new UnsupportedOperationException("Unimplemented case: " + business.getMailProvider());
            case MailProvider.POSTMARK ->
                throw new UnsupportedOperationException("Unimplemented case: " + business.getMailProvider());
            default ->
                throw new IllegalArgumentException("Unexpected value: " + business.getMailProvider());
        };
    }

    public void send(String businessId, MailMessage message) throws Exception {
        MailStrategy strategy = cache.computeIfAbsent(businessId, id -> {
            Business business = businessRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Business not found"));
            return create(business);
        });
        strategy.send(message);
    }

    public void updateMailStrategy(Business business) {
        cache.put(business.getId(), create(business));
    }
}
