package server.rem.dtos.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomerGroupResponse {
    private final String id;
    private final String name;
    private final Double percentage;
}
