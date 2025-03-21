
# 🚀 Node.js Backend Platform – Azure Blob | Azure SQL | JWT | Email | REST API

This backend application is a complete Node.js platform for managing users, vehicles, reports, notifications, issues, work logs, and file uploads. It integrates **Azure Blob Storage**, **Azure SQL Database**, **JWT authentication**, **email notifications**, and **modular route-based architecture**, along with **automated test coverage** using Jest and Supertest.

---

## 🧩 Main Features

- 🔐 JWT-based user authentication and role verification
- 🗃️ Secure connection and operations with Azure SQL Database (via `mssql`)
- ☁️ File uploads to Azure Blob Storage (via `@azure/storage-blob`)
- 📧 Email sending with Gmail SMTP via Nodemailer
- 🔄 Modular route controllers for:
  - Users (`usersController`)
  - Repairs (`reparatiiRoutes`)
  - Notifications (`notificariRoutes`)
  - Work logs / Check-ins (`pontajRoutes`)
  - Problems / Issues (`problemeRoutes`)
  - Logs (`logRoutes`)
  - Reports (`rapoarteRoutes`)
  - File uploads (`uploadFile`)
- 🧪 Unit and integration tests for all core functionalities

---

## ⚙️ Tech Stack

- Node.js / Express
- Azure Blob Storage
- Azure SQL Database (`mssql`)
- Nodemailer for email
- JSON Web Tokens (JWT)
- Multer for file uploads
- Jest + Supertest for testing
---

## 🧪 Testing with Jest & Supertest

Each controller has dedicated test files covering:

- Valid and invalid inputs
- Auth-protected routes
- CRUD operations (Create, Read, Update, Delete)
- Token and role-based access

To run tests:

```bash
npm install
npm test
