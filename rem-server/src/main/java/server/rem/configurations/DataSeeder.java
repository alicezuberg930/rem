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
import java.util.Optional;
import java.util.Random;
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
import server.rem.entities.Customer;
import server.rem.entities.CustomerGroup;
import server.rem.entities.Permission;
import server.rem.entities.Role;
import server.rem.entities.Task;
import server.rem.entities.User;
import server.rem.entities.Variant;
import server.rem.entities.VariantOption;
import server.rem.enums.AuthProvider;
import server.rem.enums.CalendarBookingStatus;
import server.rem.enums.Color;
import server.rem.enums.ContactType;
import server.rem.enums.MailProvider;
import server.rem.enums.PhoneProvider;
import server.rem.enums.TaskPriority;
import server.rem.enums.TaskStatus;
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

@Component
@Profile("seed")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String OWNER_ROLE_ID = "role_owner_seed_00000001";
    private static final String HR_ROLE_ID = "role_hr_seed_00000000001";
    private static final String ACCOUNTANT_ROLE_ID = "role_acct_seed_000000001";
    private static final String ADMIN_ROLE_ID = "role_admin_seed_0000001";
    private static final String MANAGER_ROLE_ID = "role_mgr_seed_000000001";
    private static final String SALES_ROLE_ID = "role_sales_seed_0000001";
    private static final String MARKETING_ROLE_ID = "role_mkt_seed_000000001";
    private static final String CUSTOMER_SERVICE_ROLE_ID = "role_cs_seed_0000000001";
    private static final String RECEPTIONIST_ROLE_ID = "role_recep_seed_000001";
    private static final String STAFF_ROLE_ID = "role_staff_seed_0000001";
    private static final String ALICE_ID = "user_alice_seed_0000001";
    private static final String BRIAN_ID = "user_brian_seed_0000001";
    private static final String BUSINESS_ID = "biz_rem_seed_0000000001";
    private static final String PASSWORD = "$2a$10$/KvEJP3pNsl.TMnMmz2TRe40MuMMm4YcL2PxAdll6RwXxDfpTXPB.";
    private static final ZoneId SEED_TIME_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final long USER_ROLE_RANDOM_SEED = 20_260_913L;
    private static final long TASK_RANDOM_SEED = 50_260_913L;

    private static final List<RoleSeed> ROLE_SEEDS = List.of(
            new RoleSeed(OWNER_ROLE_ID, "OWNER", "Business owner"),
            new RoleSeed(HR_ROLE_ID, "HR", "Human resources"),
            new RoleSeed(ACCOUNTANT_ROLE_ID, "ACCOUNTANT", "Accountant"),
            new RoleSeed(ADMIN_ROLE_ID, "ADMIN", "Business administrator"),
            new RoleSeed(MANAGER_ROLE_ID, "MANAGER", "Operations manager"),
            new RoleSeed(SALES_ROLE_ID, "SALES", "Sales representative"),
            new RoleSeed(MARKETING_ROLE_ID, "MARKETING", "Marketing specialist"),
            new RoleSeed(CUSTOMER_SERVICE_ROLE_ID, "CUSTOMER_SERVICE", "Customer service"),
            new RoleSeed(RECEPTIONIST_ROLE_ID, "RECEPTIONIST", "Receptionist"),
            new RoleSeed(STAFF_ROLE_ID, "STAFF", "General staff"));

    private static final List<String> NON_OWNER_ROLE_IDS = List.of(
            HR_ROLE_ID,
            ACCOUNTANT_ROLE_ID,
            ADMIN_ROLE_ID,
            MANAGER_ROLE_ID,
            SALES_ROLE_ID,
            MARKETING_ROLE_ID,
            CUSTOMER_SERVICE_ROLE_ID,
            RECEPTIONIST_ROLE_ID,
            STAFF_ROLE_ID);

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
            new PermissionSeed(59, "user.delete", "Delete users"),
            new PermissionSeed(60, "customer.create", "Create customers"),
            new PermissionSeed(61, "customer.read", "Read customers"),
            new PermissionSeed(62, "customer.edit", "Edit customers"),
            new PermissionSeed(63, "customer.delete", "Delete customers"),
            new PermissionSeed(64, "lead.create", "Create leads"),
            new PermissionSeed(65, "lead.read", "Read leads"),
            new PermissionSeed(66, "lead.edit", "Edit leads"),
            new PermissionSeed(67, "lead.delete", "Delete leads"),
            new PermissionSeed(68, "customer.export", "Export customers"),
            new PermissionSeed(69, "lead.export", "Export leads"),
            new PermissionSeed(70, "contact.export", "Export contacts"),
            new PermissionSeed(71, "campaign.export", "Export campaigns"),
            new PermissionSeed(72, "payroll.export", "Export payroll records"));

    private static final List<Integer> HR_PERMISSION_IDS = List.of(
            1, 2, 3, 6, 9, 10, 11, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 35, 48, 49, 52, 56, 57,
            58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 72);
    private static final List<Integer> ACCOUNTANT_PERMISSION_IDS = List.of(
            2, 6, 10, 19, 31, 34, 35, 36, 38, 39, 40, 41, 57, 72);
    private static final List<Integer> ADMIN_PERMISSION_IDS = List.of(
            1, 2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 71, 18, 19, 20, 21, 70, 22, 23, 24, 25,
            26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 48, 49, 50, 51, 52,
            56, 57, 58, 59, 60, 61, 62, 63, 68, 64, 65, 66, 67, 69, 72);
    private static final List<Integer> MANAGER_PERMISSION_IDS = List.of(
            2, 3, 6, 9, 10, 11, 12, 13, 14, 15, 17, 71, 18, 19, 20, 21, 70, 22, 23, 24, 26, 27, 28, 30, 31,
            32, 35, 40, 48, 49, 50, 52, 57, 60, 61, 62, 63, 68, 64, 65, 66, 67, 69, 72);
    private static final List<Integer> SALES_PERMISSION_IDS = List.of(
            6, 9, 10, 11, 18, 19, 20, 21, 70, 22, 23, 26, 27, 57, 60, 61, 62, 63, 68, 64, 65, 66, 67, 69);
    private static final List<Integer> MARKETING_PERMISSION_IDS = List.of(
            6, 13, 14, 15, 16, 17, 71, 18, 19, 70, 22, 23, 26, 27, 28, 48, 49, 50, 51, 52, 57, 61, 68, 64,
            65, 66, 69);
    private static final List<Integer> CUSTOMER_SERVICE_PERMISSION_IDS = List.of(
            6, 9, 10, 11, 18, 19, 20, 70, 22, 23, 26, 27, 57, 60, 61, 62, 68, 64, 65, 66, 69);
    private static final List<Integer> RECEPTIONIST_PERMISSION_IDS = List.of(
            6, 9, 10, 11, 18, 19, 20, 22, 23, 26, 27, 57, 60, 61, 64, 65);
    private static final List<Integer> STAFF_PERMISSION_IDS = List.of(
            1, 2, 6, 10, 19, 30, 31, 57, 61, 65);

    private static final List<VariantSeed> VARIANT_SEEDS = List.of(
            new VariantSeed(1, "Color",
                    List.of("Black", "White", "Gray", "Red", "Blue", "Green", "Yellow", "Navy", "Beige")),
            new VariantSeed(2, "Apparel Size",
                    List.of("XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL")),
            new VariantSeed(3, "Material",
                    List.of("Cotton", "Polyester", "Wool", "Linen", "Leather", "Silk", "Denim")),
            new VariantSeed(4, "Pattern",
                    List.of("Solid", "Striped", "Plaid", "Floral", "Polka Dot", "Graphic")),
            new VariantSeed(5, "Fit",
                    List.of("Slim", "Regular", "Relaxed", "Oversized")),
            new VariantSeed(6, "Style",
                    List.of("Casual", "Formal", "Sport", "Vintage", "Minimalist")),
            new VariantSeed(7, "Department",
                    List.of("Women", "Men", "Unisex", "Kids")),
            new VariantSeed(8, "Age Group",
                    List.of("Newborn", "Infant", "Toddler", "Kids", "Teen", "Adult")),
            new VariantSeed(9, "Shoe Size",
                    List.of("5", "6", "7", "8", "9", "10", "11", "12", "13")),
            new VariantSeed(10, "Shoe Width",
                    List.of("Narrow", "Standard", "Wide", "Extra Wide")),
            new VariantSeed(11, "Garment Length",
                    List.of("Cropped", "Short", "Regular", "Long", "Maxi")),
            new VariantSeed(12, "Waist Size",
                    List.of("26", "28", "30", "32", "34", "36", "38", "40")),
            new VariantSeed(13, "Inseam",
                    List.of("28 in", "30 in", "32 in", "34 in", "36 in")),
            new VariantSeed(14, "Sleeve Length",
                    List.of("Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve")),
            new VariantSeed(15, "Neckline",
                    List.of("Crew Neck", "V-Neck", "Scoop Neck", "Turtleneck", "Collared")),
            new VariantSeed(16, "Capacity",
                    List.of("250 ml", "500 ml", "750 ml", "1 L", "2 L")),
            new VariantSeed(17, "Storage Capacity",
                    List.of("64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB")),
            new VariantSeed(18, "Memory",
                    List.of("4 GB", "8 GB", "16 GB", "32 GB", "64 GB")),
            new VariantSeed(19, "Screen Size",
                    List.of("11 in", "13 in", "14 in", "15 in", "17 in", "24 in", "27 in", "32 in")),
            new VariantSeed(20, "Connectivity",
                    List.of("Wi-Fi", "Bluetooth", "Ethernet", "Cellular", "NFC")),
            new VariantSeed(21, "Voltage",
                    List.of("110 V", "120 V", "220 V", "240 V", "Dual Voltage")),
            new VariantSeed(22, "Plug Type",
                    List.of("Type A", "Type B", "Type C", "Type G", "Type I")),
            new VariantSeed(23, "Pack Size",
                    List.of("Single", "Pack of 2", "Pack of 4", "Pack of 6", "Pack of 12")),
            new VariantSeed(24, "Quantity",
                    List.of("1 Count", "5 Count", "10 Count", "25 Count", "50 Count", "100 Count")),
            new VariantSeed(25, "Weight",
                    List.of("250 g", "500 g", "1 kg", "2 kg", "5 kg")),
            new VariantSeed(26, "Flavor",
                    List.of("Original", "Vanilla", "Chocolate", "Strawberry", "Caramel", "Mint")),
            new VariantSeed(27, "Scent",
                    List.of("Unscented", "Floral", "Citrus", "Lavender", "Vanilla", "Fresh Linen")),
            new VariantSeed(28, "Skin Type",
                    List.of("Normal", "Dry", "Oily", "Combination", "Sensitive")),
            new VariantSeed(29, "Finish",
                    List.of("Matte", "Glossy", "Satin", "Metallic", "Natural")),
            new VariantSeed(30, "Shade",
                    List.of("Light", "Medium", "Tan", "Deep", "Universal")),
            new VariantSeed(31, "SPF",
                    List.of("SPF 15", "SPF 30", "SPF 50", "SPF 50+")),
            new VariantSeed(32, "Formula",
                    List.of("Liquid", "Cream", "Gel", "Powder", "Foam", "Spray")),
            new VariantSeed(33, "Subscription",
                    List.of("One-time", "Monthly", "Quarterly", "Annual")),
            new VariantSeed(34, "Condition",
                    List.of("New", "Open Box", "Refurbished", "Used")),
            new VariantSeed(35, "Edition",
                    List.of("Standard", "Deluxe", "Collector's", "Limited")),
            new VariantSeed(36, "Language",
                    List.of("English", "Spanish", "French", "German", "Japanese")),
            new VariantSeed(37, "Format",
                    List.of("Physical", "Digital", "Download", "Streaming")),
            new VariantSeed(38, "Mount Type",
                    List.of("Wall Mount", "Ceiling Mount", "Desk Mount", "Floor Stand")),
            new VariantSeed(39, "Frame Size",
                    List.of("Small", "Medium", "Large", "Extra Large")),
            new VariantSeed(40, "Compatibility",
                    List.of("Universal", "iOS", "Android", "Windows", "macOS")));

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

    private static final List<UserSeed> TASK_USER_SEEDS = List.of(
            new UserSeed("user_task_seed_000000001", "An Nguyen", "+15550002001", "1991-01-12", "task.user01@example.com"),
            new UserSeed("user_task_seed_000000002", "Binh Tran", "+15550002002", "1989-02-23", "task.user02@example.com"),
            new UserSeed("user_task_seed_000000003", "Chi Le", "+15550002003", "1993-03-08", "task.user03@example.com"),
            new UserSeed("user_task_seed_000000004", "Dung Pham", "+15550002004", "1987-04-19", "task.user04@example.com"),
            new UserSeed("user_task_seed_000000005", "Giang Hoang", "+15550002005", "1995-05-27", "task.user05@example.com"),
            new UserSeed("user_task_seed_000000006", "Ha Vo", "+15550002006", "1990-06-14", "task.user06@example.com"),
            new UserSeed("user_task_seed_000000007", "Hai Dang", "+15550002007", "1988-07-31", "task.user07@example.com"),
            new UserSeed("user_task_seed_000000008", "Khanh Bui", "+15550002008", "1994-08-16", "task.user08@example.com"),
            new UserSeed("user_task_seed_000000009", "Lam Do", "+15550002009", "1992-09-04", "task.user09@example.com"),
            new UserSeed("user_task_seed_000000010", "Linh Phan", "+15550002010", "1986-10-22", "task.user10@example.com"),
            new UserSeed("user_task_seed_000000011", "Minh Truong", "+15550002011", "1996-11-09", "task.user11@example.com"),
            new UserSeed("user_task_seed_000000012", "Nam Ngo", "+15550002012", "1991-12-18", "task.user12@example.com"),
            new UserSeed("user_task_seed_000000013", "Nga Duong", "+15550002013", "1989-01-26", "task.user13@example.com"),
            new UserSeed("user_task_seed_000000014", "Phong Ly", "+15550002014", "1993-02-11", "task.user14@example.com"),
            new UserSeed("user_task_seed_000000015", "Phuong Huynh", "+15550002015", "1987-03-29", "task.user15@example.com"),
            new UserSeed("user_task_seed_000000016", "Quang Cao", "+15550002016", "1995-04-07", "task.user16@example.com"),
            new UserSeed("user_task_seed_000000017", "Thao Mai", "+15550002017", "1990-05-24", "task.user17@example.com"),
            new UserSeed("user_task_seed_000000018", "Trang Vu", "+15550002018", "1988-06-13", "task.user18@example.com"),
            new UserSeed("user_task_seed_000000019", "Tuan Dinh", "+15550002019", "1994-07-20", "task.user19@example.com"),
            new UserSeed("user_task_seed_000000020", "Vy Luong", "+15550002020", "1992-08-02", "task.user20@example.com"));

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
    private final CustomerRepository customerRepository;
    private final ContactTagRepository contactTagRepository;
    private final ContactRepository contactRepository;
    private final CalendarBookingRepository calendarBookingRepository;
    private final TaskRepository taskRepository;
    private final VariantRepository variantRepository;

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, Role> roles = seedRoles();
        Map<Integer, Permission> permissions = seedPermissions();
        seedRolePermissions(roles, permissions);

        Map<String, User> users = seedUsers();
        Business business = seedBusiness(users.get(ALICE_ID));
        seedBusinessUsers(business, users, roles);
        seedVariants(business);

        Map<String, CustomerGroup> customerGroups = seedCustomerGroups(business);
        Map<String, ContactTag> contactTags = seedContactTags(business);
        Map<String, Contact> contacts = seedContacts(business, contactTags);
        seedCustomers(customerGroups, contacts);
        seedCalendarBookings(business, users, contacts);
        seedTasks(business, users);
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
        addPermissions(roles.get(ADMIN_ROLE_ID), permissions, ADMIN_PERMISSION_IDS);
        addPermissions(roles.get(MANAGER_ROLE_ID), permissions, MANAGER_PERMISSION_IDS);
        addPermissions(roles.get(SALES_ROLE_ID), permissions, SALES_PERMISSION_IDS);
        addPermissions(roles.get(MARKETING_ROLE_ID), permissions, MARKETING_PERMISSION_IDS);
        addPermissions(roles.get(CUSTOMER_SERVICE_ROLE_ID), permissions, CUSTOMER_SERVICE_PERMISSION_IDS);
        addPermissions(roles.get(RECEPTIONIST_ROLE_ID), permissions, RECEPTIONIST_PERMISSION_IDS);
        addPermissions(roles.get(STAFF_ROLE_ID), permissions, STAFF_PERMISSION_IDS);
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
                .provider(AuthProvider.LOCAL)
                .birthday(LocalDate.of(1990, 3, 12))
                .email("alice.nguyen@example.com")
                .password(PASSWORD)
                .isVerified(true)
                .build(), ALICE_ID)));
        users.put(BRIAN_ID, findOrCreate(userRepository, BRIAN_ID, () -> withId(User.builder()
                .fullname("Brian Tran")
                .phone("+15550001002")
                .provider(AuthProvider.LOCAL)
                .birthday(LocalDate.of(1988, 7, 24))
                .email("brian.tran@example.com")
                .password(PASSWORD)
                .isVerified(true)
                .build(), BRIAN_ID)));
        for (UserSeed seed : TASK_USER_SEEDS) {
            users.put(seed.id(), findOrCreate(userRepository, seed.id(), () -> withId(User.builder()
                    .fullname(seed.fullname())
                    .phone(seed.phone())
                    .provider(AuthProvider.LOCAL)
                    .birthday(LocalDate.parse(seed.birthday()))
                    .email(seed.email())
                    .password(PASSWORD)
                    .isVerified(true)
                    .build(), seed.id())));
        }
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

        Random random = new Random(USER_ROLE_RANDOM_SEED);
        for (UserSeed seed : TASK_USER_SEEDS) {
            BusinessUserId membershipId = new BusinessUserId(BUSINESS_ID, seed.id());
            String roleId = NON_OWNER_ROLE_IDS.get(random.nextInt(NON_OWNER_ROLE_IDS.size()));
            findOrCreate(businessUserRepository, membershipId, () -> BusinessUser.builder()
                    .id(membershipId)
                    .business(business)
                    .user(users.get(seed.id()))
                    .invitor(users.get(ALICE_ID))
                    .isActive(true)
                    .isVerified(true)
                    .role(roles.get(roleId))
                    .dependants(0)
                    .build());
        }
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

    private void seedVariants(Business business) {
        for (VariantSeed seed : VARIANT_SEEDS) {
            String id = variantId(seed.number());
            Optional<Variant> existingVariant = variantRepository.findById(id)
                    .or(() -> variantRepository.findByBusinessIdAndNameIgnoreCase(business.getId(), seed.name()));
            Variant variant = existingVariant.orElseGet(() -> withId(Variant.builder()
                            .business(business)
                            .name(seed.name())
                            .build(), id));
            boolean changed = existingVariant.isEmpty();

            if (variant.getBusiness() == null || !business.getId().equals(variant.getBusiness().getId())) {
                variant.setBusiness(business);
                changed = true;
            }
            if (!seed.name().equals(variant.getName())) {
                variant.setName(seed.name());
                changed = true;
            }

            for (int index = 0; index < seed.values().size(); index++) {
                String value = seed.values().get(index);
                VariantOption option = variant.getOptions().stream()
                        .filter(existing -> existing.getValue().equalsIgnoreCase(value))
                        .findFirst()
                        .orElse(null);

                if (option == null) {
                    option = withId(VariantOption.builder()
                            .name(value)
                            .value(value)
                            .variant(variant)
                            .build(), variantOptionId(seed.number(), index + 1));
                    variant.getOptions().add(option);
                    changed = true;
                } else if (!value.equals(option.getName()) || !value.equals(option.getValue())) {
                    option.setName(value);
                    option.setValue(value);
                    option.setVariant(variant);
                    changed = true;
                }
            }

            if (changed) {
                variantRepository.save(variant);
            }
        }
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

    private Map<String, Contact> seedContacts(Business business, Map<String, ContactTag> contactTags) {
        Map<String, Contact> contacts = new LinkedHashMap<>();
        for (ContactSeed seed : CONTACT_SEEDS) {
            Contact contact = findOrCreate(contactRepository, seed.id(), () -> withId(Contact.builder()
                    .business(business)
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

    private Map<String, Customer> seedCustomers(Map<String, CustomerGroup> customerGroups, Map<String, Contact> contacts) {
        Map<String, Customer> customers = new LinkedHashMap<>();
        for (ContactSeed seed : CONTACT_SEEDS) {
            String id = customerId(seed.id());
            Customer customer = findOrCreate(customerRepository, id, () -> withId(Customer.builder()
                    .contact(contacts.get(seed.id()))
                    .customerGroup(customerGroups.get(seed.customerGroupId()))
                    .customerSince(LocalDate.of(2026, 1, 1))
                    .build(), id));
            customers.put(id, customer);
        }
        return customers;
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

    private void seedTasks(Business business, Map<String, User> users) {
        Random random = new Random(TASK_RANDOM_SEED);
        List<User> assignees = TASK_USER_SEEDS.stream()
                .map(seed -> users.get(seed.id()))
                .toList();
        TaskPriority[] priorities = TaskPriority.values();
        TaskStatus[] statuses = TaskStatus.values();

        for (int index = 0; index < 50; index++) {
            int taskNumber = index + 1;
            String id = taskId(taskNumber);
            User assignee = index < 20 ? assignees.get(random.nextInt(assignees.size())) : null;
            String description = index < 30 ? "Seeded description for task %02d".formatted(taskNumber) : null;
            TaskPriority priority = priorities[random.nextInt(priorities.length)];
            TaskStatus status = statuses[random.nextInt(statuses.length)];
            Instant startDate = null;
            Instant dueDate = null;
            if (index >= 5) {
                LocalDate start = LocalDate.of(2026, 9, 13).plusDays(random.nextInt(18));
                LocalDate due = start.plusDays(random.nextInt(31 - start.getDayOfMonth()));
                startDate = start.atTime(9, 0).atZone(SEED_TIME_ZONE).toInstant();
                dueDate = due.atTime(17, 0).atZone(SEED_TIME_ZONE).toInstant();
            }

            Instant seededStartDate = startDate;
            Instant seededDueDate = dueDate;
            findOrCreate(taskRepository, id, () -> withId(Task.builder()
                    .business(business)
                    .assignee(assignee)
                    .title("Seed task %02d".formatted(taskNumber))
                    .priority(priority)
                    .status(status)
                    .startDate(seededStartDate)
                    .dueDate(seededDueDate)
                    .description(description)
                    .build(), id));
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

    private static String customerId(String contactId) {
        return "cust_" + contactId.substring(3);
    }

    private static String taskId(int number) {
        return "task_seed_%012d".formatted(number);
    }

    private static String variantId(int number) {
        return "variant_seed_%011d".formatted(number);
    }

    private static String variantOptionId(int variantNumber, int optionNumber) {
        return "vopt_seed_%03d_%09d".formatted(variantNumber, optionNumber);
    }

    private record RoleSeed(String id, String name, String description) {

    }

    private record PermissionSeed(int number, String name, String description) {

    }

    private record UserSeed(String id, String fullname, String phone, String birthday, String email) {

    }

    private record CustomerGroupSeed(String id, String name, double percentage) {

    }

    private record ContactTagSeed(String id, String name, Color color) {

    }

    private record VariantSeed(int number, String name, List<String> values) {

    }

    private record ContactSeed(String id, String customerGroupId, String contactTagId, String firstName,
            String lastName, String surname, String phone, String email, String birthday, String occupation,
            String note, String address, String zipCode) {

    }

    private record CalendarBookingSeed(String id, String serviceStaffId, String correspondentId, String contactId,
            String start, CalendarBookingStatus status, String cancelReason, String notAttendingReason) {

    }
}
