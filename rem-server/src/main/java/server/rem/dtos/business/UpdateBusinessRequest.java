package server.rem.dtos.business;

import java.time.LocalTime;

import server.rem.enums.MailProvider;
import server.rem.enums.PhoneProvider;

public class UpdateBusinessRequest extends CreateBusinessRequest {

    public UpdateBusinessRequest(String name, String description, String slug, String logoUrl, LocalTime workStartTime,
            Integer insuranceContributionSalary, String twilioAccountSid, String twilioAuthToken,
            String twilioPhoneNumber, String vonageApiKey, String vonageApiSecret, String cloudinaryCloudName,
            String cloudinaryApiKey, String cloudinaryApiSecret, String resendApiKey, String resendEmail,
            String mailHost, Integer mailPort, String mailUsername, String mailPassword, MailProvider mailProvider,
            PhoneProvider phoneProvider, String sendGridApiKey, String sendGridUsername, String mailgunApiKey,
            String mailgunDomain, String mailgunUsername) {
        super(name, description, slug, logoUrl, workStartTime, insuranceContributionSalary, twilioAccountSid,
                twilioAuthToken,
                twilioPhoneNumber, vonageApiKey, vonageApiSecret, cloudinaryCloudName, cloudinaryApiKey,
                cloudinaryApiSecret,
                resendApiKey, resendEmail, mailHost, mailPort, mailUsername, mailPassword, mailProvider, phoneProvider,
                sendGridApiKey, sendGridUsername, mailgunApiKey, mailgunDomain, mailgunUsername);
        // TODO Auto-generated constructor stub
    }
}