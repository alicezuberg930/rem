package server.rem.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import server.rem.dtos.payroll.CreatePayrollPeriodRequest;
import server.rem.entities.Business;
import server.rem.entities.PayrollPeriod;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PayrollPeriodMapper {
    @Mapping(target = "business", source = "business")
    @Mapping(target = "name", source = "dto.name")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "items", ignore = true)
    PayrollPeriod toEntity(CreatePayrollPeriodRequest dto, Business business);
}
