package server.rem.dtos.template;

public class UpdateTemplateRequest extends CreateTemplateRequest {
    public UpdateTemplateRequest(
            String name,
            String header,
            String body,
            String footer,
            String contactPhone,
            String websiteUrl) {
        super(name, header, body, footer, contactPhone, websiteUrl);
    }
}