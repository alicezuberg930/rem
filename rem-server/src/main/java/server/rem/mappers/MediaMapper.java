package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import server.rem.dtos.media.MediaResponse;
import server.rem.entities.Business;
import server.rem.entities.Media;
import server.rem.entities.User;

@Mapper(componentModel = "spring")
public interface MediaMapper {

    @Mapping(target = "business", source = "business")
    @Mapping(target = "owner", source = "owner")
    @Mapping(target = "storageKey", source = "storageKey")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "type", constant = "FILE")
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "size", source = "size")
    @Mapping(target = "mimeType", source = "mimeType")
    @Mapping(target = "extension", source = "extension")
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "deletedAt", ignore = true)
    Media toEntity(
            Business business,
            User owner,
            String storageKey,
            String name,
            long size,
            String mimeType,
            String extension);

    @Mapping(target = "parentId", source = "parent.id")
    MediaResponse toDto(Media media);
}
