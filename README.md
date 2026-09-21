# REM - Unified CRM, ERP & HRM, POS, Logistics Platform

REM is a comprehensive, all-in-one business management system that combines **Customer Relationship Management (CRM)**, **Enterprise Resource Planning (ERP)**, **Point of sale (POS)**, **Logistics** and **Human Resource Management (HRM)** Modules. Designed for businesses of all sizes, REM streamlines operations and enhances productivity across sales, finance, HR, and customer management.

## Key Features

### **Multi-Workspace Support**

- Create and manage multiple **workspaces (businesses)** from a single platform
- Each workspace has isolated data, users, roles, and permissions
- Seamlessly switch between businesses
- Share workspace members with custom role-based access control (RBAC)

### **CRM Module**

- **Contact Management** - Centralized customer and prospect database
- **Campaign Management** - Plan, execute, and track marketing campaigns
- **Lead Tracking** - Manage sales pipeline and lead progression
- **Customer Groups** - Segment customers for targeted strategies
- **Contact Tagging** - Organize and filter contacts efficiently
- **Communication History** - Track all customer interactions

### **ERP Module**

- **Inventory Management** - Track products and stock levels
- **Financial Management** - Invoice processing and accounting
- **Business Analytics** - Real-time insights and reporting
- **Calendar Events** - Schedule and manage business activities
- **Cloud Storage** - Integrate with Cloudinary for file management

### **HRM Module**

- **Employee Management** - Comprehensive employee database
- **Attendance Tracking** - Real-time attendance and time-off management
- **Leave Management** - Automated leave request and approval workflow
- **Payroll System** - Calculate, process, and manage employee salaries
- **Security Management** - User authentication and authorization
- **SMS Notifications** - Send updates via Twilio, Vonage, Firebase, Zalo, WhatsApp, Messenger
- **Email Notifications** - Send updates via Resend, SendGrid, Mailgun, plain SMTP.

### **Logistics Module**

### **POS Module**

### **Security & Access Control**

- Role-Based Access Control (RBAC) with granular permissions
- JWT-based authentication
- Access token & Refresh token save in httpOnly cookies
- Multi-business context with permission caching
- Business-specific role assignments
- Permission definitions: `resource.action` (e.g., `attendance.view`, `payroll.edit`, `customer.create`)

## Architecture

### **Multi-Tenant Architecture**

```markdown
[User] ─→ Login ─→ [Select Workspace]
                    ├─ Workspace A
                    ├─ Workspace B
                    └─ Workspace C
                    
Each workspace has:
- Independent users and permissions
- Isolated business data
- Custom roles with specific permissions
- Separate financial records
```

### **Authentication Flow**

The web app stores the selected business ID in localStorage under `businessId`.
API requests send it in the `X-Business-Id` header. Chat WebSocket handshakes
send it as the `business-id.<id>` subprotocol, which the server validates against
the authenticated user's business membership. Authentication tokens remain in
HTTP-only cookies.

```markdown
[1. JWT Authentication]  →  [2. Business Selection]  →  [3. Permission Loading & Caching]
User logs in              User selects workspace      Permissions fetched from DB
JWT token issued          X-Business-Id header        Cached per business
                          added to requests           Reused until business changes
```

### **Payroll flow**

```markdown
[1. Collect Data]
- Attendance records    (calculate worked days/hours)
- Leave requests        (deduct unpaid leaves)
- Business user salary  (get base salary)

[2. Calculate Payroll]
- Base salary
- + Allowances          (meal, transport, housing)
- + Bonuses             (performance, holiday)
- - Deductions          (tax, insurance, late/absent)
- = Net salary

[3. Approve Payroll]
- HR reviews
- Manager approves

[4. Pay Salary]
- Status → PAID

[Period Statuses]
      ↓
   DRAFT  ←──────────────── can edit records, add bonuses/deductions
      ↓
 PROCESSING ←────────────── submitted for manager review
      ↓
  APPROVED ←─────────────── manager approved, ready to pay
      ↓
    PAID ←──────────────── salaries transferred to employees
      
  CANCELLED ←────────────── can cancel from DRAFT or PROCESSING only
```

## Technology Stack

### Backend

- **Framework**: Spring Boot 3.x
- **Language**: Java 21+
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) & Refresh Token
- **Security**: Spring Security with method-level authorization
- **ORM**: Hibernate / Spring Data JPA
- **Build Tool**: Maven

### Frontend

- **UI**: Shadcn, Tailwindcss
- **SPA**: ReactJS 19

### Key Dependencies

- Spring Security (JWT authentication & authorization)
- Lombok (boilerplate reduction)
- MapStruct (DTO mapping)
- Hibernate Validator (data validation)
- Cloudinary (cloud storage)
- Twilio, Vonage SDKs (SMS delivery)
- SendGrid, Mailgun, Resend SDKs (Email delivery)

## To deploy on render

```docker build -t tien1411/rem-server:latest -f Dockerfile .```

```docker push tien1411/rem-server:latest```
