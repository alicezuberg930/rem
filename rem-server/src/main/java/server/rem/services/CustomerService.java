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
import lombok.RequiredArgsConstructor;
import server.rem.dtos.CustomPageResponse;
import server.rem.dtos.customer.CreateCustomerRequest;
import server.rem.dtos.customer.CustomerGroupResponse;
import server.rem.dtos.customer.CustomerResponse;
import server.rem.dtos.customer.QueryCustomer;
import server.rem.entities.Business;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.mappers.ContactMapper;
import server.rem.mappers.CustomerMapper;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.specifications.CustomerSpecification;
import server.rem.utils.ExportExcel;
import server.rem.utils.exceptions.ConflictException;
import server.rem.utils.exceptions.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private static final int EXPORT_PAGE_SIZE = 1_000;
    private static final int DEFAULT_COLUMN_WIDTH = 5_000;
    private static final int NOTE_COLUMN_INDEX = 32;
    private static final int NOTE_COLUMN_WIDTH = 12_000;
    private static final String[] EXPORT_HEADERS = {
            "ID",
            "Created At",
            "Updated At",
            "Contact ID",
            "Customer Group ID",
            "Customer Group Name",
            "Customer Group Percentage",
            "Customer Since",
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

    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final ContactMapper contactMapper;
    private final EntityManager entityManager;
    private final CustomerMapper customerMapper;

    @Transactional(readOnly = true)
    public CustomPageResponse<CustomerResponse> getAll(QueryCustomer dto, String businessId) {
        Pageable pageable = PageRequest.of(dto.getPage(), dto.getPageSize());
        Specification<Customer> spec = CustomerSpecification.withFilters(dto, businessId);
        Page<CustomerResponse> result = customerRepository.findAll(spec, pageable).map(this::toResponse);
        return new CustomPageResponse<>(result);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getOne(String id, String businessId) {
        return toResponse(getById(id, businessId));
    }

    @Transactional
    public CustomerResponse create(CreateCustomerRequest dto, String businessId) {
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_Id(contact.getId())) {
            throw new ConflictException("Contact is already a customer");
        }
        Customer customer = customerMapper.toEntity(
                dto, contact, resolveCustomerGroup(dto.getCustomerGroupId(), businessId));
        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse update(String id, CreateCustomerRequest dto, String businessId) {
        Customer customer = getById(id, businessId);
        Contact contact = getContact(dto.getContactId(), businessId);
        if (customerRepository.existsByContact_IdAndIdNot(contact.getId(), id)) {
            throw new ConflictException("Contact is already a customer");
        }
        customer.setContact(contact);
        customer.setCustomerGroup(resolveCustomerGroup(dto.getCustomerGroupId(), businessId));
        customer.setCustomerSince(dto.getCustomerSince() == null ? customer.getCustomerSince() : dto.getCustomerSince());
        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public void delete(String id, String businessId) {
        customerRepository.delete(getById(id, businessId));
    }

    @Transactional(readOnly = true)
    public void writeExcel(QueryCustomer query, String businessId, OutputStream outputStream) throws IOException {
        SXSSFWorkbook workbook = ExportExcel.createWorkbook();
        try (workbook) {
            CellStyle headerStyle = ExportExcel.createHeaderStyle(workbook);
            int sheetNumber = 1;
            SXSSFSheet sheet = createExportSheet(workbook, sheetNumber, headerStyle);
            int rowIndex = 1;
            int pageNumber = 0;
            Slice<Customer> page;

            do {
                page = customerRepository.findAllForExport(
                        businessId,
                        query.getCustomerGroupId(),
                        PageRequest.of(pageNumber, EXPORT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, "id"))
                );
                for (Customer customer : page.getContent()) {
                    if (rowIndex == ExportExcel.MAX_ROWS_PER_SHEET) {
                        sheet = createExportSheet(workbook, ++sheetNumber, headerStyle);
                        rowIndex = 1;
                    }
                    writeCustomer(sheet.createRow(rowIndex++), customer);
                }
                entityManager.clear();
                pageNumber++;
            } while (page.hasNext());

            ExportExcel.write(workbook, outputStream);
        }
    }

    CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                contactMapper.toContactResponse(customer.getContact()),
                toCustomerGroupResponse(customer.getCustomerGroup()),
                customer.getCustomerSince()
        );
    }

    private CustomerGroupResponse toCustomerGroupResponse(CustomerGroup customerGroup) {
        if (customerGroup == null) return null;
        return new CustomerGroupResponse(customerGroup.getId(), customerGroup.getName(), customerGroup.getPercentage());
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

    private void writeCustomer(Row row, Customer customer) {
        Contact contact = customer.getContact();
        Business business = contact.getBusiness();
        ContactTag tag = contact.getTag();
        CustomerGroup customerGroup = customer.getCustomerGroup();
        int columnIndex = 0;

        ExportExcel.setCellValue(row, columnIndex++, customer.getId());
        ExportExcel.setCellValue(row, columnIndex++, customer.getCreatedAt());
        ExportExcel.setCellValue(row, columnIndex++, customer.getUpdatedAt());
        ExportExcel.setCellValue(row, columnIndex++, contact.getId());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getId());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getName());
        ExportExcel.setCellValue(row, columnIndex++, customerGroup == null ? null : customerGroup.getPercentage());
        ExportExcel.setCellValue(row, columnIndex++, customer.getCustomerSince());
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

    private Customer getById(String id, String businessId) {
        return customerRepository.findByIdAndContact_Business_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    private Contact getContact(String contactId, String businessId) {
        return contactRepository.findByIdAndBusinessId(contactId, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    private CustomerGroup resolveCustomerGroup(String customerGroupId, String businessId) {
        if (customerGroupId == null) return null;
        CustomerGroup customerGroup = customerGroupRepository.findById(customerGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer group not found"));
        if (!customerGroup.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Customer group not found");
        }
        return customerGroup;
    }
}
