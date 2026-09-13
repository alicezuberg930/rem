package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.calendar_event.CreateCalendarEventRequest;
import server.rem.entities.Business;
import server.rem.entities.CalendarEvent;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CalendarEventMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "createdBy", source = "createdBy")
    @Mapping(target = "description", source = "dto.description")
    CalendarEvent toEntity(CreateCalendarEventRequest dto, Business business, User createdBy);
}
