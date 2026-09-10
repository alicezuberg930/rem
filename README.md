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

## Univer Server for Shipment Order Import and Export

The `/shipment-order` page edits workbook data in the browser. Importing and exporting `.xlsx` files uses snapshot-based exchange: the browser sends the file or workbook snapshot to Univer Server, the exchange worker converts it, and the converted result is returned to the browser. Collaboration is not required, but the conversion server, Temporal, and object storage must be running.

This repository uses Univer SDK `0.25.1`. The archived v0.25 guide uses the downloaded Univer Server `0.9.1` Docker Compose bundle. Do not replace it with the v1 server stack without migrating the client integration. See the [archived Univer Server guide](https://dream-num.github.io/documentation/v0.25/zh-CN/guides/pro/server/).

### Requirements

- Docker Engine 23 or later
- Docker Compose 2.21 or later
- At least 2 GB of memory; 4 GB or more is recommended for file conversion
- At least 10 GB of free disk space
- Linux, macOS, or Windows through WSL2

### Extract the Distribution

Run this from the directory containing the downloaded archive. Skip this step when the `univer-server-docker-compose-v0.9.1` directory already exists.

```bash
mkdir -p univer-server-docker-compose-v0.9.1
tar -xzf univer-server-docker-compose-v0.9.1.tar.gz \
  -C univer-server-docker-compose-v0.9.1
cd univer-server-docker-compose-v0.9.1
```

### Configure the Server

Keep the bundled `.env` unchanged. Create `.env.custom` in the extracted server directory for local overrides:

```dotenv
HOST_NGINX_PORT=8000
CORS_ALLOW_ORIGINS='["http://localhost:5173"]'
```

The bundled PostgreSQL, Redis, RabbitMQ, Temporal, and MinIO services are enabled by default. Their default credentials and wildcard CORS configuration are suitable only for local development.

For licensed use, copy the two unmodified license files into the server directory:

```text
univer-server-docker-compose-v0.9.1/
└── configs/
    ├── license.txt
    └── licenseKey.txt
```

The server can run without them in limited evaluation mode. A valid license is required to remove evaluation limits in production.

### Start and Verify the Server

Run all server commands from `univer-server-docker-compose-v0.9.1`:

```bash
bash run.sh start
bash run.sh check
```

The first start downloads the container images and can take several minutes. A successful health check exposes the Univer API at `http://localhost:8000`.

Check the license state:

```bash
curl http://localhost:8000/universer-api/license/key
```

Inspect the conversion services when startup or an exchange task fails:

```bash
docker compose -f docker-compose.yaml logs -f universer univer-worker-exchange univer-temporal
docker compose -f docker-compose-infra.yaml logs -f univer-minio
```

### Connect the REM Frontend

From the REM repository root, create `apps/web/.env.local`:

```dotenv
VITE_UNIVER_SERVER_URL=http://localhost:8000
VITE_UNIVER_LICENSE=
```

When using a license, set `VITE_UNIVER_LICENSE` to the complete contents of `license.txt`. Restart the frontend after changing either value:

```bash
bun run dev:web
```

Open `http://localhost:5173/shipment-order`. Import and Export remain disabled when `VITE_UNIVER_SERVER_URL` is missing.

### Server Operations

```bash
bash run.sh check
bash run.sh restart
bash run.sh stop
```

`stop` preserves the Docker volumes. `bash run.sh uninstall` removes the service volumes and all Univer Server data.

## To deploy on render

```docker build -t tien1411/rem-server:latest -f Dockerfile .```

```docker push tien1411/rem-server:latest```