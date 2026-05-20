package server.rem.utils;

import java.util.Date;
import java.util.List;
import java.util.Map;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class JWTOptions {
    private Map<String, Object> headers;
    private long expiresIn = 3600;
    private String issuer;
    private String subject;
    private List<String> audiences;
    private Date notBefore;
    private boolean includeIssuedTimestamp;
    private String jwtId;

    public JWTOptions(long expiresIn, String issuer, boolean includeIssuedTimestamp) {
        this.expiresIn = expiresIn;
        this.issuer = issuer;
        this.includeIssuedTimestamp = includeIssuedTimestamp;
    }

    // Getters and Setters
    public Map<String, Object> getHeaders() { return headers; }
    public void setHeaders(Map<String, Object> headers) { this.headers = headers; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public List<String> getAudiences() { return audiences; }
    public void setAudiences(List<String> audiences) { this.audiences = audiences; }

    public Date getNotBefore() { return notBefore; }
    public void setNotBefore(Date notBefore) { this.notBefore = notBefore; }

    public boolean isIncludeIssuedTimestamp() { return includeIssuedTimestamp; }
    public void setIncludeIssuedTimestamp(boolean includeIssuedTimestamp) { this.includeIssuedTimestamp = includeIssuedTimestamp; }

    public String getJwtId() { return jwtId; }
    public void setJwtId(String jwtId) { this.jwtId = jwtId; }
}
