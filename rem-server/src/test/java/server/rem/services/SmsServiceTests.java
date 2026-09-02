package server.rem.services;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;

import server.rem.dtos.sms.SendSmsRequest;

class SmsServiceTests {
    @Test
    void sendsTwilioMessageWithConfiguredSender() {
        SmsService smsService = new SmsService();
        ReflectionTestUtils.setField(smsService, "fromTwilioNumber", "+12025550100");
        SendSmsRequest request = new SendSmsRequest("+84900000000", "Hello");
        MessageCreator creator = mock(MessageCreator.class);
        Message message = mock(Message.class);
        when(creator.create()).thenReturn(message);
        when(message.getBody()).thenReturn("Hello");

        try (MockedStatic<Message> messages = Mockito.mockStatic(Message.class)) {
            messages.when(() -> Message.creator(
                    new PhoneNumber("+84900000000"),
                    new PhoneNumber("+12025550100"),
                    "Hello"
            )).thenReturn(creator);

            smsService.sendSmsTwilio(request);
        }

        verify(creator).create();
    }
}
