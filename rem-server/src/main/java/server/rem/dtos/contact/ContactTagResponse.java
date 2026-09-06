package server.rem.dtos.contact;

import lombok.AllArgsConstructor;
import lombok.Getter;
import server.rem.enums.Color;

@Getter
@AllArgsConstructor
public class ContactTagResponse {
    private final String id;
    private final String name;
    private final Color color;
    private final Boolean isActive;
}
