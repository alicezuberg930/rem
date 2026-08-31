INSERT IGNORE INTO roles (id, created_at, updated_at, name, description)
VALUES
  ('role_owner_seed_00000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'OWNER', 'Business owner'),
  ('role_hr_seed_00000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'HR', 'Human resources'),
  ('role_acct_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ACCOUNTANT', 'Accountant');

INSERT IGNORE INTO permissions (id, created_at, updated_at, name, description)
VALUES
  ('perm_seed_000000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'attendance.create', 'Create attendance records'),
  ('perm_seed_000000000002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'attendance.read', 'Read attendance records'),
  ('perm_seed_000000000003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'attendance.edit', 'Edit attendance records'),
  ('perm_seed_000000000004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'attendance.delete', 'Delete attendance records'),
  ('perm_seed_000000000005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'business.create', 'Create businesses'),
  ('perm_seed_000000000006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'business.read', 'Read businesses'),
  ('perm_seed_000000000007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'business.edit', 'Edit businesses'),
  ('perm_seed_000000000008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'business.delete', 'Delete businesses'),
  ('perm_seed_000000000009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'calendar.create', 'Create calendar records'),
  ('perm_seed_000000000010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'calendar.read', 'Read calendar records'),
  ('perm_seed_000000000011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'calendar.edit', 'Edit calendar records'),
  ('perm_seed_000000000012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'calendar.delete', 'Delete calendar records'),
  ('perm_seed_000000000013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'campaign.create', 'Create campaigns'),
  ('perm_seed_000000000014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'campaign.read', 'Read campaigns'),
  ('perm_seed_000000000015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'campaign.edit', 'Edit campaigns'),
  ('perm_seed_000000000016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'campaign.delete', 'Delete campaigns'),
  ('perm_seed_000000000017', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'campaign.view', 'Read campaigns'),
  ('perm_seed_000000000018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'contact.create', 'Create contacts'),
  ('perm_seed_000000000019', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'contact.read', 'Read contacts'),
  ('perm_seed_000000000020', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'contact.edit', 'Edit contacts'),
  ('perm_seed_000000000021', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'contact.delete', 'Delete contacts'),
  ('perm_seed_000000000022', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'customer_group.create', 'Create customer groups'),
  ('perm_seed_000000000023', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'customer_group.read', 'Read customer groups'),
  ('perm_seed_000000000024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'customer_group.edit', 'Edit customer groups'),
  ('perm_seed_000000000025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'customer_group.delete', 'Delete customer groups'),
  ('perm_seed_000000000026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'tag.create', 'Create tags'),
  ('perm_seed_000000000027', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'tag.read', 'Read tags'),
  ('perm_seed_000000000028', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'tag.edit', 'Edit tags'),
  ('perm_seed_000000000029', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'tag.delete', 'Delete tags'),
  ('perm_seed_000000000030', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'leave.create', 'Create leave requests'),
  ('perm_seed_000000000031', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'leave.read', 'Read leave requests'),
  ('perm_seed_000000000032', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'leave.edit', 'Edit leave requests'),
  ('perm_seed_000000000033', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'leave.delete', 'Delete leave requests'),
  ('perm_seed_000000000034', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.create', 'Create payroll records'),
  ('perm_seed_000000000035', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.read', 'Read payroll records'),
  ('perm_seed_000000000036', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.edit', 'Edit payroll records'),
  ('perm_seed_000000000037', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.delete', 'Delete payroll records'),
  ('perm_seed_000000000038', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.generate', 'Generate payroll records'),
  ('perm_seed_000000000039', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.submit', 'Submit payroll records'),
  ('perm_seed_000000000040', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.approve', 'Approve payroll records'),
  ('perm_seed_000000000041', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'payroll.pay', 'Pay payroll records'),
  ('perm_seed_000000000042', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'security.create', 'Create security records'),
  ('perm_seed_000000000043', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'security.read', 'Read security records'),
  ('perm_seed_000000000044', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'security.edit', 'Edit security records'),
  ('perm_seed_000000000045', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'security.delete', 'Delete security records'),
  ('perm_seed_000000000048', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'template.create', 'Create templates'),
  ('perm_seed_000000000049', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'template.read', 'Read templates'),
  ('perm_seed_000000000050', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'template.edit', 'Edit templates'),
  ('perm_seed_000000000051', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'template.delete', 'Delete templates'),
  ('perm_seed_000000000052', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'template.view', 'Read templates'),
  ('perm_seed_000000000056', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'user.create', 'Create users'),
  ('perm_seed_000000000057', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'user.read', 'Read users'),
  ('perm_seed_000000000058', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'user.edit', 'Edit users'),
  ('perm_seed_000000000059', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'user.delete', 'Delete users');

INSERT IGNORE INTO role_permission (role_id, permission_id)
VALUES
  ('role_owner_seed_00000001', 'perm_seed_000000000001'),
  ('role_owner_seed_00000001', 'perm_seed_000000000002'),
  ('role_owner_seed_00000001', 'perm_seed_000000000003'),
  ('role_owner_seed_00000001', 'perm_seed_000000000004'),
  ('role_owner_seed_00000001', 'perm_seed_000000000005'),
  ('role_owner_seed_00000001', 'perm_seed_000000000006'),
  ('role_owner_seed_00000001', 'perm_seed_000000000007'),
  ('role_owner_seed_00000001', 'perm_seed_000000000008'),
  ('role_owner_seed_00000001', 'perm_seed_000000000009'),
  ('role_owner_seed_00000001', 'perm_seed_000000000010'),
  ('role_owner_seed_00000001', 'perm_seed_000000000011'),
  ('role_owner_seed_00000001', 'perm_seed_000000000012'),
  ('role_owner_seed_00000001', 'perm_seed_000000000013'),
  ('role_owner_seed_00000001', 'perm_seed_000000000014'),
  ('role_owner_seed_00000001', 'perm_seed_000000000015'),
  ('role_owner_seed_00000001', 'perm_seed_000000000016'),
  ('role_owner_seed_00000001', 'perm_seed_000000000017'),
  ('role_owner_seed_00000001', 'perm_seed_000000000018'),
  ('role_owner_seed_00000001', 'perm_seed_000000000019'),
  ('role_owner_seed_00000001', 'perm_seed_000000000020'),
  ('role_owner_seed_00000001', 'perm_seed_000000000021'),
  ('role_owner_seed_00000001', 'perm_seed_000000000022'),
  ('role_owner_seed_00000001', 'perm_seed_000000000023'),
  ('role_owner_seed_00000001', 'perm_seed_000000000024'),
  ('role_owner_seed_00000001', 'perm_seed_000000000025'),
  ('role_owner_seed_00000001', 'perm_seed_000000000026'),
  ('role_owner_seed_00000001', 'perm_seed_000000000027'),
  ('role_owner_seed_00000001', 'perm_seed_000000000028'),
  ('role_owner_seed_00000001', 'perm_seed_000000000029'),
  ('role_owner_seed_00000001', 'perm_seed_000000000030'),
  ('role_owner_seed_00000001', 'perm_seed_000000000031'),
  ('role_owner_seed_00000001', 'perm_seed_000000000032'),
  ('role_owner_seed_00000001', 'perm_seed_000000000033'),
  ('role_owner_seed_00000001', 'perm_seed_000000000034'),
  ('role_owner_seed_00000001', 'perm_seed_000000000035'),
  ('role_owner_seed_00000001', 'perm_seed_000000000036'),
  ('role_owner_seed_00000001', 'perm_seed_000000000037'),
  ('role_owner_seed_00000001', 'perm_seed_000000000038'),
  ('role_owner_seed_00000001', 'perm_seed_000000000039'),
  ('role_owner_seed_00000001', 'perm_seed_000000000040'),
  ('role_owner_seed_00000001', 'perm_seed_000000000041'),
  ('role_owner_seed_00000001', 'perm_seed_000000000042'),
  ('role_owner_seed_00000001', 'perm_seed_000000000043'),
  ('role_owner_seed_00000001', 'perm_seed_000000000044'),
  ('role_owner_seed_00000001', 'perm_seed_000000000045'),
  ('role_owner_seed_00000001', 'perm_seed_000000000048'),
  ('role_owner_seed_00000001', 'perm_seed_000000000049'),
  ('role_owner_seed_00000001', 'perm_seed_000000000050'),
  ('role_owner_seed_00000001', 'perm_seed_000000000051'),
  ('role_owner_seed_00000001', 'perm_seed_000000000052'),
  ('role_owner_seed_00000001', 'perm_seed_000000000056'),
  ('role_owner_seed_00000001', 'perm_seed_000000000057'),
  ('role_owner_seed_00000001', 'perm_seed_000000000058'),
  ('role_owner_seed_00000001', 'perm_seed_000000000059'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000001'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000002'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000003'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000006'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000009'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000010'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000011'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000018'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000019'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000020'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000022'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000023'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000024'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000026'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000027'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000028'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000030'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000031'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000032'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000035'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000048'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000049'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000052'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000056'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000057'),
  ('role_hr_seed_00000000001', 'perm_seed_000000000058'),
  ('role_acct_seed_000000001', 'perm_seed_000000000002'),
  ('role_acct_seed_000000001', 'perm_seed_000000000006'),
  ('role_acct_seed_000000001', 'perm_seed_000000000010'),
  ('role_acct_seed_000000001', 'perm_seed_000000000019'),
  ('role_acct_seed_000000001', 'perm_seed_000000000031'),
  ('role_acct_seed_000000001', 'perm_seed_000000000034'),
  ('role_acct_seed_000000001', 'perm_seed_000000000035'),
  ('role_acct_seed_000000001', 'perm_seed_000000000036'),
  ('role_acct_seed_000000001', 'perm_seed_000000000038'),
  ('role_acct_seed_000000001', 'perm_seed_000000000039'),
  ('role_acct_seed_000000001', 'perm_seed_000000000040'),
  ('role_acct_seed_000000001', 'perm_seed_000000000041'),
  ('role_acct_seed_000000001', 'perm_seed_000000000057');

INSERT IGNORE INTO users (
  id, created_at, updated_at, fullname, phone, avatar, provider, birthday, email, password,
  is_verified, verify_token, verify_token_expires, reset_password_token, reset_password_expires
)
VALUES
  ('user_alice_seed_0000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Alice Nguyen', '+15550001001', NULL, 'LOCAL', '1990-03-12', 'alice.nguyen@example.com', '$2a$10$/KvEJP3pNsl.TMnMmz2TRe40MuMMm4YcL2PxAdll6RwXxDfpTXPB.', TRUE, NULL, NULL, NULL, NULL),
  ('user_brian_seed_0000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Brian Tran', '+15550001002', NULL, 'LOCAL', '1988-07-24', 'brian.tran@example.com', '$2a$10$/KvEJP3pNsl.TMnMmz2TRe40MuMMm4YcL2PxAdll6RwXxDfpTXPB.', TRUE, NULL, NULL, NULL, NULL);

INSERT IGNORE INTO businesses (
  id, created_at, updated_at, owner_user_id, description, name, slug, logo_url, work_start_time,
  insurance_contribution_salary, twilio_account_sid, twilio_auth_token, twilio_phone_number,
  vonage_api_key, vonage_api_secret, cloudinary_cloud_name, cloudinary_api_key,
  cloudinary_api_secret, resend_api_key, resend_email, mail_host, mail_port, mail_username,
  mail_password, send_grid_api_key, send_grid_username, mailgun_api_key, mailgun_domain,
  mailgun_username, mail_provider, phone_provider
)
VALUES
  ('biz_rem_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'user_alice_seed_0000001', 'Seed business for appointment data', 'Rem Clinic', 'rem-clinic', NULL, '08:30:00',
   0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SMTP', 'TWILIO');

INSERT IGNORE INTO business_user (
  business_id, user_id, invited_user_id, is_active, is_verified, role_id, salary,
  bank_owner, bank_account, bank_name, bank_code, bank_branch, dependants
)
VALUES
  ('biz_rem_seed_0000000001', 'user_alice_seed_0000001', NULL, TRUE, TRUE, 'role_owner_seed_00000001', 30000000, NULL, NULL, NULL, NULL, NULL, 0),
  ('biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', TRUE, TRUE, 'role_hr_seed_00000000001', 24000000, NULL, NULL, NULL, NULL, NULL, 1);

INSERT IGNORE INTO customer_groups (id, created_at, updated_at, name, business_id, percentage)
VALUES
  ('grp_vip_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'VIP', 'biz_rem_seed_0000000001', 15.0),
  ('grp_new_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'New Customer', 'biz_rem_seed_0000000001', 0.0),
  ('grp_return_seed_00000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Returning', 'biz_rem_seed_0000000001', 5.0),
  ('grp_corp_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Corporate', 'biz_rem_seed_0000000001', 10.0),
  ('grp_follow_seed_00000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Follow Up', 'biz_rem_seed_0000000001', 0.0);

INSERT IGNORE INTO contact_tags (id, created_at, updated_at, name, business_id, color, is_active)
VALUES
  ('tag_hot_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Hot Lead', 'biz_rem_seed_0000000001', 'RED', TRUE),
  ('tag_loyal_seed_00000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Loyal', 'biz_rem_seed_0000000001', 'GREEN', TRUE),
  ('tag_due_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Due Soon', 'biz_rem_seed_0000000001', 'YELLOW', TRUE),
  ('tag_risk_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'At Risk', 'biz_rem_seed_0000000001', 'ORANGE', TRUE),
  ('tag_ref_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Referral', 'biz_rem_seed_0000000001', 'BLUE', TRUE);

INSERT IGNORE INTO contacts (
  id, created_at, updated_at, business_id, customer_group_id, tag_id, type, first_name, last_name,
  surname, phone, mobile_phone, email, birthday, occupation, tax_code, website, facebook,
  instagram, zalo, identity_card, identity_issued_on, identity_issued_at, insurance_number,
  note, address_1, address_2, country, zip_code
)
VALUES
  ('ct_linh_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_vip_seed_0000000001', 'tag_hot_seed_0000000001', 'PERSONAL', 'Linh', 'Pham', 'Thi', '+15550100001', '+15550100001', 'linh.pham@example.com', '1992-01-18', 'Designer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Prefers morning appointments', '12 Maple St', NULL, 'US', '94103'),
  ('ct_minh_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_new_seed_0000000001', 'tag_loyal_seed_00000001', 'PERSONAL', 'Minh', 'Le', 'Van', '+15550100002', '+15550100002', 'minh.le@example.com', '1987-05-09', 'Engineer', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '44 Pine Ave', NULL, 'US', '94104'),
  ('ct_anh_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_return_seed_00000001', 'tag_due_seed_0000000001', 'PERSONAL', 'Anh', 'Vo', 'Ngoc', '+15550100003', '+15550100003', 'anh.vo@example.com', '1995-11-02', 'Consultant', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '8 Cedar Rd', NULL, 'US', '94105'),
  ('ct_quang_seed_00000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_corp_seed_000000001', 'tag_risk_seed_000000001', 'PERSONAL', 'Quang', 'Ho', 'Duc', '+15550100004', '+15550100004', 'quang.ho@example.com', '1984-08-21', 'Manager', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '19 Birch Blvd', NULL, 'US', '94106'),
  ('ct_thao_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_follow_seed_00000001', 'tag_ref_seed_0000000001', 'PERSONAL', 'Thao', 'Dang', 'My', '+15550100005', '+15550100005', 'thao.dang@example.com', '1991-12-14', 'Teacher', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '27 Oak Ln', NULL, 'US', '94107'),
  ('ct_huy_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_new_seed_0000000001', 'tag_hot_seed_0000000001', 'PERSONAL', 'Huy', 'Nguyen', 'Thanh', '+15550100006', '+15550100006', 'huy.nguyen@example.com', '1989-02-27', 'Analyst', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '31 Spruce St', NULL, 'US', '94108'),
  ('ct_mai_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_vip_seed_0000000001', 'tag_due_seed_0000000001', 'PERSONAL', 'Mai', 'Bui', 'Hong', '+15550100007', '+15550100007', 'mai.bui@example.com', '1993-06-30', 'Accountant', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '63 Willow Way', NULL, 'US', '94109'),
  ('ct_khoa_seed_000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_return_seed_00000001', 'tag_ref_seed_0000000001', 'PERSONAL', 'Khoa', 'Do', 'Gia', '+15550100008', '+15550100008', 'khoa.do@example.com', '1986-09-16', 'Founder', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '72 Ash Ct', NULL, 'US', '94110'),
  ('ct_lan_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_corp_seed_000000001', 'tag_loyal_seed_00000001', 'PERSONAL', 'Lan', 'Tran', 'Kim', '+15550100009', '+15550100009', 'lan.tran@example.com', '1994-04-04', 'Recruiter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '90 Poplar Pl', NULL, 'US', '94111'),
  ('ct_son_seed_0000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'grp_follow_seed_00000001', 'tag_risk_seed_000000001', 'PERSONAL', 'Son', 'Phan', 'Bao', '+15550100010', '+15550100010', 'son.phan@example.com', '1982-10-25', 'Architect', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '105 Elm Dr', NULL, 'US', '94112');

INSERT IGNORE INTO calendar_bookings (
  id, created_at, updated_at, business_id, service_staff_id, correspondent_id, contact_id,
  booking_start_date, booking_end_date, status, cancel_reason, not_attending_reason, complaint_reason
)
VALUES
  ('book_seed_000000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_linh_seed_000000001', '2026-08-29 09:00:00', '2026-08-29 09:45:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_minh_seed_000000001', '2026-08-29 11:15:00', '2026-08-29 12:00:00', 'ARRIVED', NULL, NULL, NULL),
  ('book_seed_000000000003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_anh_seed_0000000001', '2026-08-30 10:30:00', '2026-08-30 11:15:00', 'WAITING', NULL, NULL, NULL),
  ('book_seed_000000000004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_quang_seed_00000001', '2026-08-30 15:00:00', '2026-08-30 15:45:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_thao_seed_000000001', '2026-08-31 08:45:00', '2026-08-31 09:30:00', 'IN_ROOM', NULL, NULL, NULL),
  ('book_seed_000000000006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_huy_seed_0000000001', '2026-08-31 13:20:00', '2026-08-31 14:05:00', 'COMPLETED', NULL, NULL, NULL),
  ('book_seed_000000000007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_mai_seed_0000000001', '2026-09-01 09:10:00', '2026-09-01 09:55:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_khoa_seed_000000001', '2026-09-01 14:40:00', '2026-09-01 15:25:00', 'WAITING', NULL, NULL, NULL),
  ('book_seed_000000000009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_lan_seed_0000000001', '2026-09-02 10:00:00', '2026-09-02 10:45:00', 'ARRIVED', NULL, NULL, NULL),
  ('book_seed_000000000010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_son_seed_0000000001', '2026-09-02 16:15:00', '2026-09-02 17:00:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_minh_seed_000000001', '2026-09-03 08:30:00', '2026-09-03 09:15:00', 'COMPLETED', NULL, NULL, NULL),
  ('book_seed_000000000012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_linh_seed_000000001', '2026-09-03 12:45:00', '2026-09-03 13:30:00', 'BOUGHT_SERVICE', NULL, NULL, NULL),
  ('book_seed_000000000013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_huy_seed_0000000001', '2026-09-03 17:30:00', '2026-09-03 18:15:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_thao_seed_000000001', '2026-09-04 09:25:00', '2026-09-04 10:10:00', 'WAITING', NULL, NULL, NULL),
  ('book_seed_000000000015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_quang_seed_00000001', '2026-09-04 11:50:00', '2026-09-04 12:35:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_anh_seed_0000000001', '2026-08-29 16:40:00', '2026-08-29 17:25:00', 'COMPLETED', NULL, NULL, NULL),
  ('book_seed_000000000017', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_mai_seed_0000000001', '2026-08-30 12:20:00', '2026-08-30 13:05:00', 'BOOKED', NULL, NULL, NULL),
  ('book_seed_000000000018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_son_seed_0000000001', '2026-09-01 17:05:00', '2026-09-01 17:50:00', 'ABSENT', NULL, 'Customer did not arrive', NULL),
  ('book_seed_000000000019', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_alice_seed_0000001', 'user_brian_seed_0000001', 'ct_khoa_seed_000000001', '2026-09-02 13:35:00', '2026-09-02 14:20:00', 'CANCELLED', 'Customer requested reschedule', NULL, NULL),
  ('book_seed_000000000020', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'biz_rem_seed_0000000001', 'user_brian_seed_0000001', 'user_alice_seed_0000001', 'ct_lan_seed_0000000001', '2026-09-04 15:30:00', '2026-09-04 16:15:00', 'IN_ROOM', NULL, NULL, NULL);
