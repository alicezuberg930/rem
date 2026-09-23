package server.rem.configurations;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;

import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.BusinessUserId;
import server.rem.entities.CalendarBooking;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.entities.Permission;
import server.rem.entities.Role;
import server.rem.entities.Task;
import server.rem.entities.User;
import server.rem.entities.Variant;
import server.rem.enums.CalendarBookingStatus;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.CalendarBookingRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.ContactTagRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.repositories.CustomerRepository;
import server.rem.repositories.PermissionRepository;
import server.rem.repositories.RoleRepository;
import server.rem.repositories.TaskRepository;
import server.rem.repositories.UserRepository;
import server.rem.repositories.VariantRepository;

@ExtendWith(MockitoExtension.class)
class DataSeederTests {
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PermissionRepository permissionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BusinessRepository businessRepository;
    @Mock
    private BusinessUserRepository businessUserRepository;
    @Mock
    private CustomerGroupRepository customerGroupRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ContactTagRepository contactTagRepository;
    @Mock
    private ContactRepository contactRepository;
    @Mock
    private CalendarBookingRepository calendarBookingRepository;
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private VariantRepository variantRepository;

    private final Map<String, Role> roles = new LinkedHashMap<>();
    private final Map<String, Permission> permissions = new LinkedHashMap<>();
    private final Map<String, User> users = new LinkedHashMap<>();
    private final Map<String, Business> businesses = new LinkedHashMap<>();
    private final Map<BusinessUserId, BusinessUser> businessUsers = new LinkedHashMap<>();
    private final Map<String, CustomerGroup> customerGroups = new LinkedHashMap<>();
    private final Map<String, Customer> customers = new LinkedHashMap<>();
    private final Map<String, ContactTag> contactTags = new LinkedHashMap<>();
    private final Map<String, Contact> contacts = new LinkedHashMap<>();
    private final Map<String, CalendarBooking> bookings = new LinkedHashMap<>();
    private final Map<String, Task> tasks = new LinkedHashMap<>();
    private final Map<String, Variant> variants = new LinkedHashMap<>();

    private DataSeeder dataSeeder;

    @BeforeEach
    void setUp() {
        stubRepositories();
        dataSeeder = new DataSeeder(
                roleRepository,
                permissionRepository,
                userRepository,
                businessRepository,
                businessUserRepository,
                customerGroupRepository,
                customerRepository,
                contactTagRepository,
                contactRepository,
                calendarBookingRepository,
                taskRepository,
                variantRepository);
    }

    @Test
    void seedsAllDataSqlRecordsThroughRepositories() throws Exception {
        dataSeeder.run();

        assertTrue(CommandLineRunner.class.isAssignableFrom(DataSeeder.class));
        Profile profile = DataSeeder.class.getAnnotation(Profile.class);
        assertArrayEquals(new String[] { "seed" }, profile.value());
        assertEquals(10, roles.size());
        assertEquals(67, permissions.size());
        assertEquals(22, users.size());
        assertEquals(1, businesses.size());
        assertEquals(22, businessUsers.size());
        assertEquals(5, customerGroups.size());
        assertEquals(10, customers.size());
        assertEquals(5, contactTags.size());
        assertEquals(10, contacts.size());
        assertEquals(20, bookings.size());
        assertEquals(50, tasks.size());
        assertEquals(40, variants.size());
        assertEquals(215, variants.values().stream().mapToInt(variant -> variant.getOptions().size()).sum());

        assertPermissionCount("role_owner_seed_00000001", 67);
        assertPermissionCount("role_hr_seed_00000000001", 38);
        assertPermissionCount("role_acct_seed_000000001", 14);
        assertPermissionCount("role_admin_seed_0000001", 64);
        assertPermissionCount("role_mgr_seed_000000001", 44);
        assertPermissionCount("role_sales_seed_0000001", 24);
        assertPermissionCount("role_mkt_seed_000000001", 27);
        assertPermissionCount("role_cs_seed_0000000001", 21);
        assertPermissionCount("role_recep_seed_000001", 16);
        assertPermissionCount("role_staff_seed_0000001", 10);
        assertRoleName("role_admin_seed_0000001", "ADMIN");
        assertRoleName("role_mgr_seed_000000001", "MANAGER");
        assertRoleName("role_sales_seed_0000001", "SALES");
        assertRoleName("role_mkt_seed_000000001", "MARKETING");
        assertRoleName("role_cs_seed_0000000001", "CUSTOMER_SERVICE");
        assertRoleName("role_recep_seed_000001", "RECEPTIONIST");
        assertRoleName("role_staff_seed_0000001", "STAFF");
        assertRoleHasPermissions("role_admin_seed_0000001", "user.create", "security.edit", "campaign.export");
        assertRoleHasPermissions("role_mgr_seed_000000001", "calendar.delete", "payroll.approve", "customer.export");
        assertRoleHasPermissions("role_sales_seed_0000001", "lead.create", "customer.edit", "contact.export");
        assertRoleHasPermissions("role_mkt_seed_000000001", "campaign.create", "template.edit", "lead.export");
        assertRoleHasPermissions("role_cs_seed_0000000001", "calendar.edit", "customer.edit", "lead.export");
        assertRoleHasPermissions("role_recep_seed_000001", "calendar.create", "contact.create", "lead.read");
        assertRoleHasPermissions("role_staff_seed_0000001", "attendance.create", "leave.create", "customer.read");
        assertPermissionSeeded("customer.create");
        assertPermissionSeeded("customer.read");
        assertPermissionSeeded("customer.edit");
        assertPermissionSeeded("customer.delete");
        assertPermissionSeeded("lead.create");
        assertPermissionSeeded("lead.read");
        assertPermissionSeeded("lead.edit");
        assertPermissionSeeded("lead.delete");
        assertPermissionSeeded("customer.export");
        assertPermissionSeeded("lead.export");
        assertPermissionSeeded("contact.export");
        assertPermissionSeeded("campaign.export");

        User alice = users.get("user_alice_seed_0000001");
        User brian = users.get("user_brian_seed_0000001");
        Business business = businesses.get("biz_rem_seed_0000000001");
        assertSame(alice, business.getOwner());
        assertEquals("Rem Clinic", business.getName());

        BusinessUser brianMembership = businessUsers.get(
                new BusinessUserId("biz_rem_seed_0000000001", "user_brian_seed_0000001"));
        assertSame(brian, brianMembership.getUser());
        assertSame(alice, brianMembership.getInvitor());
        assertSame(roles.get("role_hr_seed_00000000001"), brianMembership.getRole());

        assertEquals(20, businessUsers.values().stream()
                .filter(membership -> membership.getUser().getId().startsWith("user_task_seed_"))
                .count());
        assertTrue(businessUsers.values().stream()
                .filter(membership -> membership.getUser().getId().startsWith("user_task_seed_"))
                .noneMatch(membership -> "role_owner_seed_00000001".equals(membership.getRole().getId())));

        assertEquals(20, tasks.values().stream().filter(task -> task.getAssignee() != null).count());
        assertEquals(30, tasks.values().stream().filter(task -> task.getAssignee() == null).count());
        assertEquals(5, tasks.values().stream()
                .filter(task -> task.getStartDate() == null && task.getDueDate() == null)
                .count());
        assertEquals(30, tasks.values().stream().filter(task -> task.getDescription() != null).count());
        assertEquals(20, tasks.values().stream().filter(task -> task.getDescription() == null).count());
        Instant dateRangeStart = Instant.parse("2026-09-12T17:00:00Z");
        Instant dateRangeEnd = Instant.parse("2026-09-30T17:00:00Z");
        assertTrue(tasks.values().stream().allMatch(task -> task.getBusiness() == business));
        assertTrue(tasks.values().stream()
                .filter(task -> task.getAssignee() != null)
                .allMatch(task -> task.getAssignee().getId().startsWith("user_task_seed_")));
        assertTrue(tasks.values().stream()
                .filter(task -> task.getStartDate() != null)
                .allMatch(task -> !task.getStartDate().isBefore(dateRangeStart)
                        && task.getStartDate().isBefore(dateRangeEnd)
                        && !task.getDueDate().isBefore(task.getStartDate())
                        && task.getDueDate().isBefore(dateRangeEnd)));

        Variant color = variants.get("variant_seed_00000000001");
        assertSame(business, color.getBusiness());
        assertEquals("Color", color.getName());
        assertEquals(Set.of("Black", "White", "Gray", "Red", "Blue", "Green", "Yellow", "Navy", "Beige"),
                color.getOptions().stream().map(option -> option.getValue()).collect(Collectors.toSet()));
        assertTrue(variants.values().stream()
                .flatMap(variant -> variant.getOptions().stream())
                .allMatch(option -> option.getName().equals(option.getValue()) && option.getVariant() != null));

        Contact linh = contacts.get("ct_linh_seed_000000001");
        assertSame(business, linh.getBusiness());
        assertSame(contactTags.get("tag_hot_seed_0000000001"), linh.getTag());
        assertEquals("Prefers morning appointments", linh.getNote());

        Customer linhCustomer = customers.get("cust_linh_seed_000000001");
        assertSame(linh, linhCustomer.getContact());
        assertSame(customerGroups.get("grp_vip_seed_0000000001"), linhCustomer.getCustomerGroup());

        CalendarBooking firstBooking = bookings.get("book_seed_000000000001");
        assertSame(linh, firstBooking.getContact());
        assertSame(alice, firstBooking.getServiceStaff());
        assertSame(brian, firstBooking.getCorrespondent());
        assertEquals(Instant.parse("2026-08-29T02:00:00Z"), firstBooking.getBookingStartDate());
        assertEquals(Instant.parse("2026-08-29T02:45:00Z"), firstBooking.getBookingEndDate());

        CalendarBooking absentBooking = bookings.get("book_seed_000000000018");
        assertEquals(CalendarBookingStatus.ABSENT, absentBooking.getStatus());
        assertEquals("Customer did not arrive", absentBooking.getNotAttendingReason());

        CalendarBooking cancelledBooking = bookings.get("book_seed_000000000019");
        assertEquals(CalendarBookingStatus.CANCELLED, cancelledBooking.getStatus());
        assertEquals("Customer requested reschedule", cancelledBooking.getCancelReason());
    }

    @Test
    void skipsRecordsThatHaveAlreadyBeenSeeded() throws Exception {
        dataSeeder.run();
        clearRepositoryInvocations();

        dataSeeder.run();

        verify(roleRepository, never()).save(any(Role.class));
        verify(permissionRepository, never()).save(any(Permission.class));
        verify(userRepository, never()).save(any(User.class));
        verify(businessRepository, never()).save(any(Business.class));
        verify(businessUserRepository, never()).save(any(BusinessUser.class));
        verify(customerGroupRepository, never()).save(any(CustomerGroup.class));
        verify(customerRepository, never()).save(any(Customer.class));
        verify(contactTagRepository, never()).save(any(ContactTag.class));
        verify(contactRepository, never()).save(any(Contact.class));
        verify(calendarBookingRepository, never()).save(any(CalendarBooking.class));
        verify(taskRepository, never()).save(any(Task.class));
        verify(variantRepository, never()).save(any(Variant.class));
    }

    private void assertPermissionCount(String roleId, int expectedCount) {
        Set<String> permissionIds = roles.get(roleId).getPermissions().stream()
                .map(Permission::getId)
                .collect(Collectors.toSet());
        assertEquals(expectedCount, permissionIds.size());
    }

    private void assertRoleName(String roleId, String expectedName) {
        assertEquals(expectedName, roles.get(roleId).getName());
    }

    private void assertRoleHasPermissions(String roleId, String... expectedPermissionNames) {
        Set<String> permissionNames = roles.get(roleId).getPermissions().stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());
        for (String expectedPermissionName : expectedPermissionNames) {
            assertTrue(permissionNames.contains(expectedPermissionName));
        }
    }

    private void assertPermissionSeeded(String permissionName) {
        assertTrue(permissions.values().stream().anyMatch(permission -> permissionName.equals(permission.getName())));
    }

    private void stubRepositories() {
        when(roleRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(roles.get(invocation.getArgument(0))));
        when(roleRepository.save(any(Role.class))).thenAnswer(invocation -> {
            Role role = invocation.getArgument(0);
            roles.put(role.getId(), role);
            return role;
        });

        when(permissionRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(permissions.get(invocation.getArgument(0))));
        when(permissionRepository.save(any(Permission.class))).thenAnswer(invocation -> {
            Permission permission = invocation.getArgument(0);
            permissions.put(permission.getId(), permission);
            return permission;
        });

        when(userRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(users.get(invocation.getArgument(0))));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            users.put(user.getId(), user);
            return user;
        });

        when(businessRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(businesses.get(invocation.getArgument(0))));
        when(businessRepository.save(any(Business.class))).thenAnswer(invocation -> {
            Business business = invocation.getArgument(0);
            businesses.put(business.getId(), business);
            return business;
        });

        when(businessUserRepository.findById(any(BusinessUserId.class)))
                .thenAnswer(invocation -> Optional.ofNullable(businessUsers.get(invocation.getArgument(0))));
        when(businessUserRepository.save(any(BusinessUser.class))).thenAnswer(invocation -> {
            BusinessUser businessUser = invocation.getArgument(0);
            businessUsers.put(businessUser.getId(), businessUser);
            return businessUser;
        });

        when(customerGroupRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(customerGroups.get(invocation.getArgument(0))));
        when(customerGroupRepository.save(any(CustomerGroup.class))).thenAnswer(invocation -> {
            CustomerGroup customerGroup = invocation.getArgument(0);
            customerGroups.put(customerGroup.getId(), customerGroup);
            return customerGroup;
        });

        when(customerRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(customers.get(invocation.getArgument(0))));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer customer = invocation.getArgument(0);
            customers.put(customer.getId(), customer);
            return customer;
        });

        when(contactTagRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(contactTags.get(invocation.getArgument(0))));
        when(contactTagRepository.save(any(ContactTag.class))).thenAnswer(invocation -> {
            ContactTag contactTag = invocation.getArgument(0);
            contactTags.put(contactTag.getId(), contactTag);
            return contactTag;
        });

        when(contactRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(contacts.get(invocation.getArgument(0))));
        when(contactRepository.save(any(Contact.class))).thenAnswer(invocation -> {
            Contact contact = invocation.getArgument(0);
            contacts.put(contact.getId(), contact);
            return contact;
        });

        when(calendarBookingRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(bookings.get(invocation.getArgument(0))));
        when(calendarBookingRepository.save(any(CalendarBooking.class))).thenAnswer(invocation -> {
            CalendarBooking booking = invocation.getArgument(0);
            bookings.put(booking.getId(), booking);
            return booking;
        });

        when(taskRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(tasks.get(invocation.getArgument(0))));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            tasks.put(task.getId(), task);
            return task;
        });

        when(variantRepository.findById(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(variants.get(invocation.getArgument(0))));
        when(variantRepository.findByBusinessIdAndNameIgnoreCase(anyString(), anyString()))
                .thenAnswer(invocation -> {
                    String businessId = invocation.getArgument(0);
                    String name = invocation.getArgument(1);
                    return variants.values().stream()
                            .filter(variant -> businessId.equals(variant.getBusiness().getId())
                                    && name.equalsIgnoreCase(variant.getName()))
                            .findFirst();
                });
        when(variantRepository.save(any(Variant.class))).thenAnswer(invocation -> {
            Variant variant = invocation.getArgument(0);
            variants.put(variant.getId(), variant);
            return variant;
        });
    }

    private void clearRepositoryInvocations() {
        clearInvocations(
                roleRepository,
                permissionRepository,
                userRepository,
                businessRepository,
                businessUserRepository,
                customerGroupRepository,
                customerRepository,
                contactTagRepository,
                contactRepository,
                calendarBookingRepository,
                taskRepository,
                variantRepository);
    }
}
