# 🏆 WorkZen SHRMS: A Modern, Modular Human Resource Management System

## Project Submission: Hackathon Entry 2025

**WorkZen SHRMS** is a comprehensive, full-stack Human Resource Management System engineered to demonstrate robust **Role-Based Access Control (RBAC)**, seamless integration between core HR functions, and complex business logic for payroll processing. Our solution delivers four distinct, segregated user portals, ensuring security, efficiency, and role-specific workflows.

## ✨ Why WorkZen SHRMS Should Win (Innovations & Technical Merit)

### 1. Advanced Role-Based Security Model 🔒
* **4-Tier Access Control:** Features dedicated views and permissions for **Admin, HR, Payroll, and Employee** roles.
* **JWT & Express Middleware:** All critical API endpoints are protected using token-based authentication and custom role middleware (`roleMiddleware.js`), ensuring that a Payroll Officer, for instance, cannot access employee creation endpoints.

### 2. Automated Employee Lifecycle Management 🤖
* **Dual Account Provisioning:** The Admin/HR Officer creates an employee, which automatically triggers the creation of two linked documents: the **Employee Profile** (`Employee.js`) and the **User Login Account** (`User.js`).
* **Unique ID Generation:** Unique `userId` and `loginId` are generated programmatically based on company code and employee details (`idGenerator.js`).
* **Login-Activated Attendance:** Upon a successful user login (`/api/auth/login`), the system automatically inserts or updates the employee's **Attendance** record for the current day as "Present".

### 3. Modular & Configurable Payroll Engine 💰
* **Dynamic Deductions:** The Payroll processing function (`payrollController.js`) fetches dynamic rates (PF, Tax %) from the central **Settings** model to accurately calculate Net Pay.
* **Payroll Officer Control:** Provides a controlled environment where the Payroll Officer can manage settings and initiate payroll runs (`PayrollManagement.jsx`, `SettingsPage.jsx`).

## 📊 Core Technology Stack

| Category | Technology | Key Component / File |
| :--- | :--- | :--- |
| **Backend** | **Node.js, Express.js** | `Backend/server.js` |
| **Database**| **MongoDB / Mongoose** | `Backend/config/db.js`, `Backend/models/*.js` |
| **Frontend** | **React (with Vite)** | `newfrontend/src/App.jsx` |
| **UI/UX** | **Material-UI (MUI), Tailwind CSS** | `newfrontend/package.json`, `newfrontend/src/index.css` |
| **Analytics** | **Recharts** | `newfrontend/src/pages/dashboards/payroll/AnalyticsPage.jsx` |
| **Routing** | **React Router DOM (v6)** | `newfrontend/src/App.jsx` |

## 🎯 Detailed Role-Based Access Control (RBAC)

The system enforces strict access boundaries across all major modules to reflect real-world HR responsibilities.

### 1. Company Admin (Super User) 👑
| Feature | Permissions |
| :--- | :--- |
| **Registration** | ✅ Registers the company and becomes the first Super User. |
| **Data Access (CRUD)** | ✅ Full Create, Read, Update, and Delete access across **ALL** modules (Employee, HR, Payroll, Leave, Attendance, Analytics). |
| **System Management** | ✅ Manages user roles and system-wide settings (e.g., adding HR/Payroll Officers). |
| **Access Limits** | **None.** The Admin oversees all system operations. |

### 2. Employee 🧑‍💼
| Feature | Permissions |
| :--- | :--- |
| **Time Off** | ✅ Apply for new leave and view the status (Pending/Approved/Rejected). |
| **Personal Records** | ✅ View personal Attendance records and metrics (Present/Absent days). |
| **Directory** | ✅ Access the Employee Directory to view colleagues' basic information (Read-Only). |
| **Prohibited Access**| ❌ Cannot access or modify settings, payroll data, or detailed salary information. |

### 3. HR Officer 🙋‍♀️
| Module | Permissions |
| :--- | :--- |
| **Employee Profiles**| ✅ Create new employee profiles and update existing employee details (e.g., designation, personal info). |
| **Leave Management** | ✅ Monitor, review, approve, and reject all employee time-off requests. |
| **Attendance** | ✅ Monitor and manually manage (add/edit/delete) attendance records for all employees. |
| **Prohibited Access**| ❌ Cannot access or modify Payroll data, system-wide financial settings, or Admin settings. |

### 4. Payroll Officer 💸
| Module | Permissions |
| :--- | :--- |
| **Payroll Processing**| ✅ Manages payroll runs, processes payroll for individual employees, and generates payslips/reports. |
| **Time Off** | ✅ Accesses and approves or rejects time-off requests (as part of payroll pre-processing). |
| **Salary Settings** | ✅ Can access and modify salary-related configurations (e.g., PF/Tax rates) on the Settings page. |
| **Prohibited Access**| ❌ Cannot create new employees or modify core employee profile data. |

## 🚀 Setup and Installation Guide

Follow these instructions to quickly deploy the application for demonstration and testing.

### Prerequisites

* Node.js (v18+)
* npm
* MongoDB Instance

### Step 1: Backend Setup (`Backend/`)

1.  Navigate into the `Backend` directory:
    ```bash
    cd Backend
    npm install
    ```
2.  Create and edit the `.env` file for database connection:
    ```env
    # .env in Backend/ directory
    PORT=5000
    MONGO_URI="mongodb://localhost:27017/workzen-hrms"
    JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY"
    ```
3.  Start the API server:
    ```bash
    npm run dev
    ```
    (Server runs at `http://localhost:5000/api`)

### Step 2: Frontend Setup (`newfrontend/`)

1.  Navigate into the `newfrontend` directory:
    ```bash
    cd ../newfrontend
    npm install
    ```
2.  Start the React development server:
    ```bash
    npm run dev
    ```
    (App opens in browser, typically at `http://localhost:5173`)

## 🔑 Initial Demo Flow

To effectively demonstrate the entire system to the judges:

1.  **Start Here:** Open `http://localhost:5173/` and complete the **Company Registration**.
2.  **Admin Portal:** Log in as the Company Admin (`/company/dashboard`) and use the **Employee Management** page to create users for all other roles (HR, Payroll, Employee).
3.  **Cross-Role Interaction:**
    * Log in as **Employee** (`/employee/leaves`) and apply for time off.
    * Log in as **Payroll Officer** (`/payroll/dashboard`) and use the **Pending Leave Requests** table to approve/reject the request.
    * Log in as **HR Officer** (`/hr/attendance`) to confirm the employee's login-triggered attendance and manually verify their check-in time.

---
**WorkZen SHRMS:** Secure, Integrated, and Ready to Scale.