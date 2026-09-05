package server.rem.configurations;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import server.rem.entities.Base;
import server.rem.entities.Business;
import server.rem.entities.BusinessUser;
import server.rem.entities.BusinessUserId;
import server.rem.entities.CalendarBooking;
import server.rem.entities.Contact;
import server.rem.entities.ContactTag;
import server.rem.entities.CustomerGroup;
import server.rem.entities.Permission;
import server.rem.entities.Role;
import server.rem.entities.User;
import server.rem.enums.CalendarBookingStatus;
import server.rem.enums.Color;
import server.rem.enums.ContactType;
import server.rem.enums.MailProvider;
import server.rem.enums.PhoneProvider;
import server.rem.enums.Provider;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.BusinessUserRepository;
import server.rem.repositories.CalendarBookingRepository;
import server.rem.repositories.ContactRepository;
import server.rem.repositories.ContactTagRepository;
import server.rem.repositories.CustomerGroupRepository;
import server.rem.repositories.PermissionRepository;
import server.rem.repositories.RoleRepository;
import server.rem.repositories.UserRepository;

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private static final String OWNER_ROLE_ID = "role_owner_seed_00000001";
    private static final String HR_ROLE_ID = "role_hr_seed_00000000001";
    private static final String ACCOUNTANT_ROLE_ID = "role_acct_seed_000000001";
    private static final String ALICE_ID = "user_alice_seed_0000001";
    private static final String BRIAN_ID = "user_brian_seed_0000001";
    private static final String BUSINESS_ID = "biz_rem_seed_0000000001";
    private static final String PASSWORD = "$2a$10$/KvEJP3pNsl.TMnMmz2TRe40MuMMm4YcL2PxAdll6RwXxDfpTXPB.";
    private static final ZoneId SEED_TIME_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private static final List<RoleSeed> ROLE_SEEDS = List.of(
            new RoleSeed(OWNER_ROLE_ID, "OWNER", "Business owner"),
            new RoleSeed(HR_ROLE_ID, "HR", "Human resources"),
            new RoleSeed(ACCOUNTANT_ROLE_ID, "ACCOUNTANT", "Accountant"));

    private static final List<PermissionSeed> PERMISSION_SEEDS = List.of(
            new PermissionSeed(1, "attendance.create", "Create attendance records"),
            new PermissionSeed(2, "attendance.read", "Read attendance records"),
            new PermissionSeed(3, "attendance.edit", "Edit attendance records"),
            new PermissionSeed(4, "attendance.delete", "Delete attendance records"),
            new PermissionSeed(5, "business.create", "Create businesses"),
            new PermissionSeed(6, "business.read", "Read businesses"),
            new PermissionSeed(7, "business.edit", "Edit businesses"),
            new PermissionSeed(8, "business.delete", "Delete businesses"),
            new PermissionSeed(9, "calendar.create", "Create calendar records"),
            new PermissionSeed(10, "calendar.read", "Read calendar records"),
            new PermissionSeed(11, "calendar.edit", "Edit calendar records"),
            new PermissionSeed(12, "calendar.delete", "Delete calendar records"),
            new PermissionSeed(13, "campaign.create", "Create campaigns"),
            new PermissionSeed(14, "campaign.read", "Read campaigns"),
            new PermissionSeed(15, "campaign.edit", "Edit campaigns"),
            new PermissionSeed(16, "campaign.delete", "Delete campaigns"),
            new PermissionSeed(17, "campaign.view", "Read campaigns"),
            new PermissionSeed(18, "contact.create", "Create contacts"),
            new PermissionSeed(19, "contact.read", "Read contacts"),
            new PermissionSeed(20, "contact.edit", "Edit contacts"),
            new PermissionSeed(21, "contact.delete", "Delete contacts"),
            new PermissionSeed(22, "customer_group.create", "Create customer groups"),
            new PermissionSeed(23, "customer_group.read", "Read customer groups"),
            new PermissionSeed(24, "customer_group.edit", "Edit customer groups"),
            new PermissionSeed(25, "customer_group.delete", "Delete customer groups"),
            new PermissionSeed(26, "tag.create", "Create tags"),
            new PermissionSeed(27, "tag.read", "Read tags"),
            new PermissionSeed(28, "tag.edit", "Edit tags"),
            new PermissionSeed(29, "tag.delete", "Delete tags"),
            new PermissionSeed(30, "leave.create", "Create leave requests"),
            new PermissionSeed(31, "leave.read", "Read leave requests"),
            new PermissionSeed(32, "leave.edit", "Edit leave requests"),
            new PermissionSeed(33, "leave.delete", "Delete leave requests"),
            new PermissionSeed(34, "payroll.create", "Create payroll records"),
            new PermissionSeed(35, "payroll.read", "Read payroll records"),
            new PermissionSeed(36, "payroll.edit", "Edit payroll records"),
            new PermissionSeed(37, "payroll.delete", "Delete payroll records"),
            new PermissionSeed(38, "payroll.generate", "Generate payroll records"),
            new PermissionSeed(39, "payroll.submit", "Submit payroll records"),
            new PermissionSeed(40, "payroll.approve", "Approve payroll records"),
            new PermissionSeed(41, "payroll.pay", "Pay payroll records"),
            new PermissionSeed(42, "security.create", "Create security records"),
            new PermissionSeed(43, "security.read", "Read security records"),
            new PermissionSeed(44, "security.edit", "Edit security records"),
            new PermissionSeed(45, "security.delete", "Delete security records"),
            new PermissionSeed(48, "template.create", "Create templates"),
            new PermissionSeed(49, "template.read", "Read templates"),
            new PermissionSeed(50, "template.edit", "Edit templates"),
            new PermissionSeed(51, "template.delete", "Delete templates"),
            new PermissionSeed(52, "template.view", "Read templates"),
            new PermissionSeed(56, "user.create", "Create users"),
            new PermissionSeed(57, "user.read", "Read users"),
            new PermissionSeed(58, "user.edit", "Edit users"),
            new PermissionSeed(59, "user.delete", "Delete users"));

    private static final List<Integer> HR_PERMISSION_IDS = List.of(
            1, 2, 3, 6, 9, 10, 11, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 35, 48, 49, 52, 56, 57,
            58);
    private static final List<Integer> ACCOUNTANT_PERMISSION_IDS = List.of(
            2, 6, 10, 19, 31, 34, 35, 36, 38, 39, 40, 41, 57);

    private static final List<CustomerGroupSeed> CUSTOMER_GROUP_SEEDS = List.of(
            new CustomerGroupSeed("grp_vip_seed_0000000001", "VIP", 15.0),
            new CustomerGroupSeed("grp_new_seed_0000000001", "New Customer", 0.0),
            new CustomerGroupSeed("grp_return_seed_00000001", "Returning", 5.0),
            new CustomerGroupSeed("grp_corp_seed_000000001", "Corporate", 10.0),
            new CustomerGroupSeed("grp_follow_seed_00000001", "Follow Up", 0.0));

    private static final List<ContactTagSeed> CONTACT_TAG_SEEDS = List.of(
            new ContactTagSeed("tag_hot_seed_0000000001", "Hot Lead", Color.RED),
            new ContactTagSeed("tag_loyal_seed_00000001", "Loyal", Color.GREEN),
            new ContactTagSeed("tag_due_seed_0000000001", "Due Soon", Color.YELLOW),
            new ContactTagSeed("tag_risk_seed_000000001", "At Risk", Color.ORANGE),
            new ContactTagSeed("tag_ref_seed_0000000001", "Referral", Color.BLUE));

    private static final List<ContactSeed> CONTACT_SEEDS = List.of(
            new ContactSeed("ct_linh_seed_000000001", "grp_vip_seed_0000000001", "tag_hot_seed_0000000001",
                    "Linh", "Pham", "Thi", "+15550100001", "linh.pham@example.com", "1992-01-18", "Designer",
                    "Prefers morning appointments", "12 Maple St", "94103"),
            new ContactSeed("ct_minh_seed_000000001", "grp_new_seed_0000000001", "tag_loyal_seed_00000001",
                    "Minh", "Le", "Van", "+15550100002", "minh.le@example.com", "1987-05-09", "Engineer", null,
                    "44 Pine Ave", "94104"),
            new ContactSeed("ct_anh_seed_0000000001", "grp_return_seed_00000001", "tag_due_seed_0000000001",
                    "Anh", "Vo", "Ngoc", "+15550100003", "anh.vo@example.com", "1995-11-02", "Consultant", null,
                    "8 Cedar Rd", "94105"),
            new ContactSeed("ct_quang_seed_00000001", "grp_corp_seed_000000001", "tag_risk_seed_000000001",
                    "Quang", "Ho", "Duc", "+15550100004", "quang.ho@example.com", "1984-08-21", "Manager", null,
                    "19 Birch Blvd", "94106"),
            new ContactSeed("ct_thao_seed_000000001", "grp_follow_seed_00000001", "tag_ref_seed_0000000001",
                    "Thao", "Dang", "My", "+15550100005", "thao.dang@example.com", "1991-12-14", "Teacher", null,
                    "27 Oak Ln", "94107"),
            new ContactSeed("ct_huy_seed_0000000001", "grp_new_seed_0000000001", "tag_hot_seed_0000000001",
                    "Huy", "Nguyen", "Thanh", "+15550100006", "huy.nguyen@example.com", "1989-02-27", "Analyst",
                    null, "31 Spruce St", "94108"),
            new ContactSeed("ct_mai_seed_0000000001", "grp_vip_seed_0000000001", "tag_due_seed_0000000001",
                    "Mai", "Bui", "Hong", "+15550100007", "mai.bui@example.com", "1993-06-30", "Accountant",
                    null, "63 Willow Way", "94109"),
            new ContactSeed("ct_khoa_seed_000000001", "grp_return_seed_00000001", "tag_ref_seed_0000000001",
                    "Khoa", "Do", "Gia", "+15550100008", "khoa.do@example.com", "1986-09-16", "Founder", null,
                    "72 Ash Ct", "94110"),
            new ContactSeed("ct_lan_seed_0000000001", "grp_corp_seed_000000001", "tag_loyal_seed_00000001",
                    "Lan", "Tran", "Kim", "+15550100009", "lan.tran@example.com", "1994-04-04", "Recruiter", null,
                    "90 Poplar Pl", "94111"),
            new ContactSeed("ct_son_seed_0000000001", "grp_follow_seed_00000001", "tag_risk_seed_000000001",
                    "Son", "Phan", "Bao", "+15550100010", "son.phan@example.com", "1982-10-25", "Architect",
                    null, "105 Elm Dr", "94112"));

    private static final List<CalendarBookingSeed> CALENDAR_BOOKING_SEEDS = List.of(
            new CalendarBookingSeed("book_seed_000000000001", ALICE_ID, BRIAN_ID, "ct_linh_seed_000000001",
                    "2026-08-29T09:00", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000002", BRIAN_ID, ALICE_ID, "ct_minh_seed_000000001",
                    "2026-08-29T11:15", CalendarBookingStatus.ARRIVED, null, null),
            new CalendarBookingSeed("book_seed_000000000003", ALICE_ID, BRIAN_ID, "ct_anh_seed_0000000001",
                    "2026-08-30T10:30", CalendarBookingStatus.WAITING, null, null),
            new CalendarBookingSeed("book_seed_000000000004", BRIAN_ID, ALICE_ID, "ct_quang_seed_00000001",
                    "2026-08-30T15:00", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000005", ALICE_ID, BRIAN_ID, "ct_thao_seed_000000001",
                    "2026-08-31T08:45", CalendarBookingStatus.IN_ROOM, null, null),
            new CalendarBookingSeed("book_seed_000000000006", BRIAN_ID, ALICE_ID, "ct_huy_seed_0000000001",
                    "2026-08-31T13:20", CalendarBookingStatus.COMPLETED, null, null),
            new CalendarBookingSeed("book_seed_000000000007", ALICE_ID, BRIAN_ID, "ct_mai_seed_0000000001",
                    "2026-09-01T09:10", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000008", BRIAN_ID, ALICE_ID, "ct_khoa_seed_000000001",
                    "2026-09-01T14:40", CalendarBookingStatus.WAITING, null, null),
            new CalendarBookingSeed("book_seed_000000000009", ALICE_ID, BRIAN_ID, "ct_lan_seed_0000000001",
                    "2026-09-02T10:00", CalendarBookingStatus.ARRIVED, null, null),
            new CalendarBookingSeed("book_seed_000000000010", BRIAN_ID, ALICE_ID, "ct_son_seed_0000000001",
                    "2026-09-02T16:15", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000011", ALICE_ID, BRIAN_ID, "ct_minh_seed_000000001",
                    "2026-09-03T08:30", CalendarBookingStatus.COMPLETED, null, null),
            new CalendarBookingSeed("book_seed_000000000012", BRIAN_ID, ALICE_ID, "ct_linh_seed_000000001",
                    "2026-09-03T12:45", CalendarBookingStatus.BOUGHT_SERVICE, null, null),
            new CalendarBookingSeed("book_seed_000000000013", ALICE_ID, BRIAN_ID, "ct_huy_seed_0000000001",
                    "2026-09-03T17:30", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000014", BRIAN_ID, ALICE_ID, "ct_thao_seed_000000001",
                    "2026-09-04T09:25", CalendarBookingStatus.WAITING, null, null),
            new CalendarBookingSeed("book_seed_000000000015", ALICE_ID, BRIAN_ID, "ct_quang_seed_00000001",
                    "2026-09-04T11:50", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000016", BRIAN_ID, ALICE_ID, "ct_anh_seed_0000000001",
                    "2026-08-29T16:40", CalendarBookingStatus.COMPLETED, null, null),
            new CalendarBookingSeed("book_seed_000000000017", ALICE_ID, BRIAN_ID, "ct_mai_seed_0000000001",
                    "2026-08-30T12:20", CalendarBookingStatus.BOOKED, null, null),
            new CalendarBookingSeed("book_seed_000000000018", BRIAN_ID, ALICE_ID, "ct_son_seed_0000000001",
                    "2026-09-01T17:05", CalendarBookingStatus.ABSENT, null, "Customer did not arrive"),
            new CalendarBookingSeed("book_seed_000000000019", ALICE_ID, BRIAN_ID, "ct_khoa_seed_000000001",
                    "2026-09-02T13:35", CalendarBookingStatus.CANCELLED, "Customer requested reschedule", null),
            new CalendarBookingSeed("book_seed_000000000020", BRIAN_ID, ALICE_ID, "ct_lan_seed_0000000001",
                    "2026-09-04T15:30", CalendarBookingStatus.IN_ROOM, null, null));

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final BusinessUserRepository businessUserRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final ContactTagRepository contactTagRepository;
    private final ContactRepository contactRepository;
    private final CalendarBookingRepository calendarBookingRepository;

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, Role> roles = seedRoles();
        Map<Integer, Permission> permissions = seedPermissions();
        seedRolePermissions(roles, permissions);

        Map<String, User> users = seedUsers();
        Business business = seedBusiness(users.get(ALICE_ID));
        seedBusinessUsers(business, users, roles);

        Map<String, CustomerGroup> customerGroups = seedCustomerGroups(business);
        Map<String, ContactTag> contactTags = seedContactTags(business);
        Map<String, Contact> contacts = seedContacts(business, customerGroups, contactTags);
        seedCalendarBookings(business, users, contacts);
    }

    private Map<String, Role> seedRoles() {
        Map<String, Role> roles = new LinkedHashMap<>();
        for (RoleSeed seed : ROLE_SEEDS) {
            Role role = findOrCreate(roleRepository, seed.id(), () -> withId(Role.builder()
                    .name(seed.name())
                    .description(seed.description())
                    .permissions(new LinkedHashSet<>())
                    .build(), seed.id()));
            roles.put(seed.id(), role);
        }
        return roles;
    }

    private Map<Integer, Permission> seedPermissions() {
        Map<Integer, Permission> permissions = new LinkedHashMap<>();
        for (PermissionSeed seed : PERMISSION_SEEDS) {
            String id = permissionId(seed.number());
            Permission permission = findOrCreate(permissionRepository, id, () -> withId(Permission.builder()
                    .name(seed.name())
                    .description(seed.description())
                    .build(), id));
            permissions.put(seed.number(), permission);
        }
        return permissions;
    }

    private void seedRolePermissions(Map<String, Role> roles, Map<Integer, Permission> permissions) {
        addPermissions(roles.get(OWNER_ROLE_ID), permissions, permissions.keySet());
        addPermissions(roles.get(HR_ROLE_ID), permissions, HR_PERMISSION_IDS);
        addPermissions(roles.get(ACCOUNTANT_ROLE_ID), permissions, ACCOUNTANT_PERMISSION_IDS);
    }

    private void addPermissions(Role role, Map<Integer, Permission> permissions, Iterable<Integer> permissionIds) {
        Set<Permission> assignedPermissions = role.getPermissions();
        if (assignedPermissions == null) {
            assignedPermissions = new LinkedHashSet<>();
            role.setPermissions(assignedPermissions);
        }

        Set<String> assignedIds = new LinkedHashSet<>();
        for (Permission assignedPermission : assignedPermissions) {
            assignedIds.add(assignedPermission.getId());
        }

        boolean changed = false;
        for (Integer permissionId : permissionIds) {
            Permission permission = permissions.get(permissionId);
            if (assignedIds.add(permission.getId())) {
                assignedPermissions.add(permission);
                changed = true;
            }
        }

        if (changed) {
            roleRepository.save(role);
        }
    }

    private Map<String, User> seedUsers() {
        Map<String, User> users = new LinkedHashMap<>();
        users.put(ALICE_ID, findOrCreate(userRepository, ALICE_ID, () -> withId(User.builder()
                .fullname("Alice Nguyen")
                .phone("+15550001001")
                .provider(Provider.LOCAL)
                .birthday(LocalDate.of(1990, 3, 12))
                .email("alice.nguyen@example.com")
                .password(PASSWORD)
                .isVerified(true)
                .build(), ALICE_ID)));
        users.put(BRIAN_ID, findOrCreate(userRepository, BRIAN_ID, () -> withId(User.builder()
                .fullname("Brian Tran")
                .phone("+15550001002")
                .provider(Provider.LOCAL)
                .birthday(LocalDate.of(1988, 7, 24))
                .email("brian.tran@example.com")
                .password(PASSWORD)
                .isVerified(true)
                .build(), BRIAN_ID)));
        return users;
    }

    private Business seedBusiness(User owner) {
        return findOrCreate(businessRepository, BUSINESS_ID, () -> withId(Business.builder()
                .owner(owner)
                .description("Seed business for appointment data")
                .name("Rem Clinic")
                .slug("rem-clinic")
                .workStartTime(LocalTime.of(8, 30))
                .insuranceContributionSalary(0)
                .mailProvider(MailProvider.SMTP)
                .phoneProvider(PhoneProvider.TWILIO)
                .build(), BUSINESS_ID));
    }

    private void seedBusinessUsers(Business business, Map<String, User> users, Map<String, Role> roles) {
        BusinessUserId ownerId = new BusinessUserId(BUSINESS_ID, ALICE_ID);
        findOrCreate(businessUserRepository, ownerId, () -> BusinessUser.builder()
                .id(ownerId)
                .business(business)
                .user(users.get(ALICE_ID))
                .isActive(true)
                .isVerified(true)
                .role(roles.get(OWNER_ROLE_ID))
                .salary(30_000_000)
                .dependants(0)
                .build());

        BusinessUserId employeeId = new BusinessUserId(BUSINESS_ID, BRIAN_ID);
        findOrCreate(businessUserRepository, employeeId, () -> BusinessUser.builder()
                .id(employeeId)
                .business(business)
                .user(users.get(BRIAN_ID))
                .invitor(users.get(ALICE_ID))
                .isActive(true)
                .isVerified(true)
                .role(roles.get(HR_ROLE_ID))
                .salary(24_000_000)
                .dependants(1)
                .build());
    }

    private Map<String, CustomerGroup> seedCustomerGroups(Business business) {
        Map<String, CustomerGroup> customerGroups = new LinkedHashMap<>();
        for (CustomerGroupSeed seed : CUSTOMER_GROUP_SEEDS) {
            CustomerGroup customerGroup = findOrCreate(customerGroupRepository, seed.id(),
                    () -> withId(CustomerGroup.builder()
                            .name(seed.name())
                            .business(business)
                            .percentage(seed.percentage())
                            .build(), seed.id()));
            customerGroups.put(seed.id(), customerGroup);
        }
        return customerGroups;
    }

    private Map<String, ContactTag> seedContactTags(Business business) {
        Map<String, ContactTag> contactTags = new LinkedHashMap<>();
        for (ContactTagSeed seed : CONTACT_TAG_SEEDS) {
            ContactTag contactTag = findOrCreate(contactTagRepository, seed.id(), () -> withId(ContactTag.builder()
                    .name(seed.name())
                    .business(business)
                    .color(seed.color())
                    .isActive(true)
                    .build(), seed.id()));
            contactTags.put(seed.id(), contactTag);
        }
        return contactTags;
    }

    private Map<String, Contact> seedContacts(Business business, Map<String, CustomerGroup> customerGroups,
            Map<String, ContactTag> contactTags) {
        Map<String, Contact> contacts = new LinkedHashMap<>();
        for (ContactSeed seed : CONTACT_SEEDS) {
            Contact contact = findOrCreate(contactRepository, seed.id(), () -> withId(Contact.builder()
                    .business(business)
                    .customerGroup(customerGroups.get(seed.customerGroupId()))
                    .tag(contactTags.get(seed.contactTagId()))
                    .type(ContactType.PERSONAL)
                    .firstName(seed.firstName())
                    .lastName(seed.lastName())
                    .surname(seed.surname())
                    .phone(seed.phone())
                    .mobilePhone(seed.phone())
                    .email(seed.email())
                    .birthday(seed.birthday())
                    .occupation(seed.occupation())
                    .note(seed.note())
                    .address1(seed.address())
                    .country("US")
                    .zipCode(seed.zipCode())
                    .build(), seed.id()));
            contacts.put(seed.id(), contact);
        }
        return contacts;
    }

    private void seedCalendarBookings(Business business, Map<String, User> users, Map<String, Contact> contacts) {
        for (CalendarBookingSeed seed : CALENDAR_BOOKING_SEEDS) {
            findOrCreate(calendarBookingRepository, seed.id(), () -> {
                Instant start = LocalDateTime.parse(seed.start()).atZone(SEED_TIME_ZONE).toInstant();
                return withId(CalendarBooking.builder()
                        .business(business)
                        .serviceStaff(users.get(seed.serviceStaffId()))
                        .correspondent(users.get(seed.correspondentId()))
                        .contact(contacts.get(seed.contactId()))
                        .bookingStartDate(start)
                        .bookingEndDate(start.plusSeconds(45 * 60))
                        .status(seed.status())
                        .cancelReason(seed.cancelReason())
                        .notAttendingReason(seed.notAttendingReason())
                        .build(), seed.id());
            });
        }
    }

    private <T, ID> T findOrCreate(JpaRepository<T, ID> repository, ID id, Supplier<T> factory) {
        return repository.findById(id).orElseGet(() -> repository.save(factory.get()));
    }

    private static <T extends Base> T withId(T entity, String id) {
        entity.setId(id);
        return entity;
    }

    private static String permissionId(int number) {
        return "perm_seed_%012d".formatted(number);
    }

    private record RoleSeed(String id, String name, String description) {
    }

    private record PermissionSeed(int number, String name, String description) {
    }

    private record CustomerGroupSeed(String id, String name, double percentage) {
    }

    private record ContactTagSeed(String id, String name, Color color) {
    }

    private record ContactSeed(String id, String customerGroupId, String contactTagId, String firstName,
            String lastName, String surname, String phone, String email, String birthday, String occupation,
            String note, String address, String zipCode) {
    }

    private record CalendarBookingSeed(String id, String serviceStaffId, String correspondentId, String contactId,
            String start, CalendarBookingStatus status, String cancelReason, String notAttendingReason) {
    }
}
