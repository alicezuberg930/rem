package server.rem.mappers;

import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.group.CreateGroupRequest;
import server.rem.entities.Business;
import server.rem.entities.Group;
import server.rem.entities.User;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GroupMapper {
    @Mapping(target = "name", expression = "java(dto.getName().trim())")
    @Mapping(target = "avatar", expression = "java(dto.getAvatar().trim())")
    @Mapping(target = "business", source = "business")
    @Mapping(target = "members", source = "members")
    Group toEntity(CreateGroupRequest dto, Business business, Set<User> members);
}
