package server.rem.services;

import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.lead.ConvertLeadsRequest;
import server.rem.dtos.lead.CreateLeadRequest;
import server.rem.dtos.lead.LeadResponse;
import server.rem.dtos.lead.QueryLead;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.Customer;
import server.rem.entities.Lead;
import server.rem.enums.LeadStatus;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.repositories.LeadRepository;
import server.rem.specifications.LeadSpecification;
import server.rem.utils.ExportExcel;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class LeadService {
    private static final int EXPORT_PAGE_SIZE = 1_000;
    private static final int DEFAULT_COLUMN_WIDTH = 5_000;
    private static final int NOTE_COLUMN_INDEX = 30;
    private static final int NOTE_COLUMN_WIDTH = 12_000;
    private static final String[] EXPORT_HEADERS = {
            "ID",
            "Created At",
            "Updated At",
            "Source",
            "Status",
            "Contact ID",
            "Business ID",
            "Business Name",
            "Tag ID",
            "Tag Name",
            "Tag Color",
            "Tag Active",
            "Contact Type",
            "First Name",
            "Last Name",
            "Surname",
            "Phone",
            "Mobile Phone",
            "Email",
            "Birthday",
            "Occupation",
            "Tax Code",
            "Website",
            "Facebook",
            "Instagram",
            "Zalo",
            "Identity Card",
            "Identity Issued On",
            "Identity Issued At",
            "Insurance Number",
            "Note",
            "Address 1",
            "Address 2",
            "Country",
            "Zip Code"
    };

    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final ContactMapper contactMapper;
    private final CustomerService customerService;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public CustomPageResponse<LeadResponse> getAll(QueryLead dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Lead> spec = LeadSpecification.withFilters(dto, businessId);
        Page<LeadResponse> result = leadRepository.findAll(spec, pageable).map(this::toResponse);
        return new CustomPageResponse<>(result);
    }

    @Transactional(readOnly = true)
    public LeadResponse getOne(String id, String businessId) {
        return toResponse(getById(id, businessId));
    }

    @Transactional
    public LeadResponse create(CreateLeadRequest dto, String businessId) {
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a customer");
        }
        if (leadRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a lead");
        }
        Lead lead = Lead.builder()
                .contact(contact)
                .source(dto.getSource())
                .status(dto.getStatus())
                .build();
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public LeadResponse update(String id, CreateLeadRequest dto, String businessId) {
        Lead lead = getById(id, businessId);
        Contact contact = getContact(dto.getContactId(), businessId);
        if (leadRepository.existsByContact_IdAndIdNot(contact.getId(), id)) {
            throw new ConflictException("Contact is already a lead");
        }
        if (customerRepository.existsByContact_Id(contact.getId()) && dto.getStatus() != LeadStatus.CONVERTED) {
            throw new ConflictException("Contact is already a customer");
        }
        lead.setContact(contact);
        lead.setSource(dto.getSource());
        lead.setStatus(dto.getStatus());
        return toResponse(leadRepository.save(lead));
    }

    @Transactional
    public void delete(String id, String businessId) {
        leadRepository.delete(getById(id, businessId));
    }

    @Transactional
    public List<CustomerResponse> convert(ConvertLeadsRequest dto, String businessId) {
        LinkedHashSet<String> leadIds = new LinkedHashSet<>(dto.getLeadIds());
        if (leadIds.isEmpty()) {
            throw new IllegalArgumentException("Lead IDs are required");
        }
        List<Lead> leads = leadRepository.findByIdInAndContact_Business_Id(leadIds, businessId);
        if (leads.size() != leadIds.size()) {
            throw new ResourceNotFoundException("Lead not found");
        }

        Map<String, Lead> leadsById = leads.stream().collect(Collectors.toMap(Lead::getId, Function.identity()));
        List<CustomerResponse> customers = new ArrayList<>(leadIds.size());
        for (String leadId : leadIds) {
            Lead lead = leadsById.get(leadId);
            Customer customer = customerRepository.findByContact_Id(lead.getContact().getId())
                    .orElseGet(() -> customerRepository.save(Customer.builder()
                            .contact(lead.getContact())
                            .customerSince(LocalDate.now())
                            .build()));
            lead.setStatus(LeadStatus.CONVERTED);
            customers.add(customerService.toResponse(customer));
        }
        leadRepository.saveAll(leads);
        return customers;
    }

    @Transactional(readOnly = true)
    public void writeExcel(QueryLead query, String businessId, OutputStream outputStream) throws IOException {
        SXSSFWorkbook workbook = ExportExcel.createWorkbook();
        try (workbook) {
            CellStyle headerStyle = ExportExcel.createHeaderStyle(workbook);
            int sheetNumber = 1;
            SXSSFSheet sheet = createExportSheet(workbook, sheetNumber, headerStyle);
            int rowIndex = 1;
            int pageNumber = 0;
            Slice<Lead> page;

            do {
                page = leadRepository.findAllForExport(
                        businessId,
                        query.getSource(),
                        query.getStatus(),
                        PageRequest.of(pageNumber, EXPORT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, "id"))
                );
                for (Lead lead : page.getContent()) {
                    if (rowIndex == ExportExcel.MAX_ROWS_PER_SHEET) {
                        sheet = createExportSheet(workbook, ++sheetNumber, headerStyle);
                        rowIndex = 1;
                    }
                    writeLead(sheet.createRow(rowIndex++), lead);
                }
                entityManager.clear();
                pageNumber++;
            } while (page.hasNext());

            ExportExcel.write(workbook, outputStream);
        }
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                contactMapper.toContactResponse(lead.getContact()),
                lead.getSource(),
                lead.getStatus()
        );
    }

    private SXSSFSheet createExportSheet(SXSSFWorkbook workbook, int sheetNumber, CellStyle headerStyle) {
        String name = sheetNumber == 1 ? "Leads" : "Leads " + sheetNumber;
        return ExportExcel.createSheet(
                workbook,
                name,
                EXPORT_HEADERS,
                headerStyle,
                columnIndex -> columnIndex == NOTE_COLUMN_INDEX ? NOTE_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH
        );
    }

    private void writeLead(Row row, Lead lead) {
        Contact contact = lead.getContact();
        Business business = contact.getBusiness();
        ContactTag tag = contact.getTag();
        int columnIndex = 0;

        ExportExcel.setCellValue(row, columnIndex++, lead.getId());
        ExportExcel.setCellValue(row, columnIndex++, lead.getCreatedAt());
        ExportExcel.setCellValue(row, columnIndex++, lead.getUpdatedAt());
        ExportExcel.setCellValue(row, columnIndex++, lead.getSource());
        ExportExcel.setCellValue(row, columnIndex++, lead.getStatus());
        ExportExcel.setCellValue(row, columnIndex++, contact.getId());
        ExportExcel.setCellValue(row, columnIndex++, business == null ? null : business.getId());
        ExportExcel.setCellValue(row, columnIndex++, business == null ? null : business.getName());
        ExportExcel.setCellValue(row, columnIndex++, tag == null ? null : tag.getId());
        ExportExcel.setCellValue(row, columnIndex++, tag == null ? null : tag.getName());
        ExportExcel.setCellValue(row, columnIndex++, tag == null ? null : tag.getColor());
        ExportExcel.setCellValue(row, columnIndex++, tag == null ? null : tag.getIsActive());
        ExportExcel.setCellValue(row, columnIndex++, contact.getType());
        ExportExcel.setCellValue(row, columnIndex++, contact.getFirstName());
        ExportExcel.setCellValue(row, columnIndex++, contact.getLastName());
        ExportExcel.setCellValue(row, columnIndex++, contact.getSurname());
        ExportExcel.setCellValue(row, columnIndex++, contact.getPhone());
        ExportExcel.setCellValue(row, columnIndex++, contact.getMobilePhone());
        ExportExcel.setCellValue(row, columnIndex++, contact.getEmail());
        ExportExcel.setCellValue(row, columnIndex++, contact.getBirthday());
        ExportExcel.setCellValue(row, columnIndex++, contact.getOccupation());
        ExportExcel.setCellValue(row, columnIndex++, contact.getTaxCode());
        ExportExcel.setCellValue(row, columnIndex++, contact.getWebsite());
        ExportExcel.setCellValue(row, columnIndex++, contact.getFacebook());
        ExportExcel.setCellValue(row, columnIndex++, contact.getInstagram());
        ExportExcel.setCellValue(row, columnIndex++, contact.getZalo());
        ExportExcel.setCellValue(row, columnIndex++, contact.getIdentityCard());
        ExportExcel.setCellValue(row, columnIndex++, contact.getIdentityIssuedOn());
        ExportExcel.setCellValue(row, columnIndex++, contact.getIdentityIssuedAt());
        ExportExcel.setCellValue(row, columnIndex++, contact.getInsuranceNumber());
        ExportExcel.setCellValue(row, columnIndex++, contact.getNote());
        ExportExcel.setCellValue(row, columnIndex++, contact.getAddress1());
        ExportExcel.setCellValue(row, columnIndex++, contact.getAddress2());
        ExportExcel.setCellValue(row, columnIndex++, contact.getCountry());
        ExportExcel.setCellValue(row, columnIndex, contact.getZipCode());
    }

    private Lead getById(String id, String businessId) {
        return leadRepository.findByIdAndContact_Business_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
    }

    private Contact getContact(String contactId, String businessId) {
        return contactRepository.findByIdAndBusinessId(contactId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }
}
