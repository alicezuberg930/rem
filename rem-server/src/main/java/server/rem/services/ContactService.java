package server.rem.services;

import java.io.IOException;
import java.io.OutputStream;

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
import lombok.AllArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.contact.ContactResponse;
import server.rem.dtos.contact.CreateContactRequest;
import server.rem.dtos.contact.QueryContact;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.ContactMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.ContactTagRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.specifications.ContactSpecification;
import server.rem.utils.ExportExcel;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@AllArgsConstructor
public class ContactService {
    private static final int EXPORT_PAGE_SIZE = 1_000;
    private static final int DEFAULT_COLUMN_WIDTH = 5_000;
    private static final int NOTE_COLUMN_INDEX = 30;
    private static final int NOTE_COLUMN_WIDTH = 12_000;
    private static final String[] EXPORT_HEADERS = {
            "ID",
            "Created At",
            "Updated At",
            "Business ID",
            "Business Name",
            "Customer Group ID",
            "Customer Group Name",
            "Customer Group Percentage",
            "Tag ID",
            "Tag Name",
            "Tag Color",
            "Tag Active",
            "Type",
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

    private final ContactRepository contactRepository;
    private final BusinessRepository businessRepository;
    private final ContactTagRepository contactTagRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final ContactMapper contactMapper;
    private final EntityManager entityManager;

    public CustomPageResponse<ContactResponse> getAll(QueryContact dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Contact> spec = ContactSpecification.withFilters(dto, businessId);
        Page<ContactResponse> result = contactRepository.findAll(spec, pageable).map(contactMapper::toContactResponse);
        return new CustomPageResponse<ContactResponse>(result);
    }

    public Contact getOne(String id) {
        return contactRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Contact create(CreateContactRequest dto) {
        Business business = businessRepository.findById(dto.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));
        ContactTag tag = contactTagRepository.findById(dto.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        CustomerGroup customerGroup = resolveCustomerGroup(dto.getCustomerGroupId());

        if (contactRepository.existsByEmailAndBusinessId(dto.getEmail(), dto.getBusinessId())) {
            throw new RuntimeException("Contact with email '" + dto.getEmail() + "' already exists in this business");
        }

        Contact contact = contactMapper.toEntity(dto, business, tag, customerGroup);
        return contactRepository.save(contact);
    }

    public Contact update(String id, CreateContactRequest dto) {
        Contact contact = getOne(id);
        ContactTag tag = contactTagRepository.findById(dto.getTagId())
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        CustomerGroup customerGroup = resolveCustomerGroup(dto.getCustomerGroupId());

        contactMapper.updateEntity(dto, tag, customerGroup, contact);
        return contactRepository.save(contact);
    }

    public void delete(String id) {
        contactRepository.delete(getOne(id));
    }

    private CustomerGroup resolveCustomerGroup(String customerGroupId) {
        if (customerGroupId == null) return null;
        return customerGroupRepository.findById(customerGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer group not found"));
    }

    @Transactional(readOnly = true)
    public void writeExcel(QueryContact query, String businessId, OutputStream outputStream) throws IOException {
        SXSSFWorkbook workbook = ExportExcel.createWorkbook();
        try (workbook) {
            CellStyle headerStyle = ExportExcel.createHeaderStyle(workbook);
            int sheetNumber = 1;
            SXSSFSheet sheet = createExportSheet(workbook, sheetNumber, headerStyle);
            int rowIndex = 1;
            int pageNumber = 0;
            Slice<Contact> page;

            do {
                page = contactRepository.findAllForExport(
                        businessId,
                        query.getType(),
                        query.getCustomerGroupId(),
                        PageRequest.of(pageNumber, EXPORT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, "id"))
                );
                for (Contact contact : page.getContent()) {
                    if (rowIndex == ExportExcel.MAX_ROWS_PER_SHEET) {
                        sheet = this.createExportSheet(workbook, ++sheetNumber, headerStyle);
                        rowIndex = 1;
                    }
                    this.writeContact(sheet.createRow(rowIndex++), contact);
                }
                entityManager.clear();
                pageNumber++;
            } while (page.hasNext());

            ExportExcel.write(workbook, outputStream);
        }
    }

    private SXSSFSheet createExportSheet(SXSSFWorkbook workbook, int sheetNumber, CellStyle headerStyle) {
        String name = sheetNumber == 1 ? "Customers" : "Customers " + sheetNumber;
        return ExportExcel.createSheet(
                workbook,
                name,
                EXPORT_HEADERS,
                headerStyle,
                columnIndex -> columnIndex == NOTE_COLUMN_INDEX ? NOTE_COLUMN_WIDTH : DEFAULT_COLUMN_WIDTH
        );
    }

    private void writeContact(Row row, Contact contact) {
        CustomerGroup customerGroup = contact.getCustomerGroup();
        ContactTag tag = contact.getTag();
        int columnIndex = 0;

        ExportExcel.setCellValue(row, columnIndex++, contact.getId());
        ExportExcel.setCellValue(row, columnIndex++, contact.getCreatedAt());
        ExportExcel.setCellValue(row, columnIndex++, contact.getUpdatedAt());
        ExportExcel.setCellValue(row, columnIndex++, contact.getBusiness().getId());
        ExportExcel.setCellValue(row, columnIndex++, contact.getBusiness().getName());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getId());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getName());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getPercentage());
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
}
