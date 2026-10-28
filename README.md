# PeopleDesk Employee Management System

A small MERN employee directory with role-based login, admin employee management, and employee self-service profiles.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB connection URI

## Setup and run

Open three terminals from the project root.

### 1. Configure the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` if MongoDB is not available at the default local URI. Set `JWT_SECRET` to a long, random secret before deployment.

### 2. Seed sample users

In the backend terminal:

```powershell
npm run seed
```

The seed command is safe to rerun: it creates missing accounts and leaves existing accounts unchanged. Default local demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@ems.local` | `Admin123!` |
| Employee | `alex@ems.local` | `Employee123!` |
| Employee | `jordan@ems.local` | `Employee123!` |
| Employee | `taylor@ems.local` | `Employee123!` |

Override the admin seed credentials with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `backend/.env`. These demo passwords are for local testing only.

To set or update the admin login on an existing database, run this from `backend` in PowerShell. Enter the password at the secure prompt; it is not saved in shell history:

```powershell
$env:EMS_ADMIN_EMAIL = "thanigai243@gmail.com"
$securePassword = Read-Host "Admin password" -AsSecureString
$env:EMS_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
npm run set-admin
Remove-Item Env:EMS_ADMIN_EMAIL, Env:EMS_ADMIN_PASSWORD
Remove-Variable securePassword
```

The command updates the account with that email, or reuses an existing admin account if the email is new. It creates an account only when neither exists. The password is hashed with bcrypt before it is stored.

### 3. Start the API

In the backend terminal:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Start the frontend

In a new terminal from the project root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

## Available functionality

- Login for admin and employee accounts; the role is determined by the account, not a client-side selector.
- Admins can search, add, edit, and delete employee accounts. New accounts receive a password that the admin supplies.
- Employees can view their own profile. Only admins can access the employee directory and write endpoints.
- Passwords are hashed with bcrypt; authenticated requests use signed JWTs.
- Form and API validation handles invalid fields, duplicate email addresses, missing accounts, and authentication/authorization errors.

## API overview

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/employees/me` (authenticated employee profile)
- `GET /api/employees?search=...` (admin)
- `POST /api/employees` (admin)
- `PUT /api/employees/:id` (admin)
- `DELETE /api/employees/:id` (admin)
- `GET /api/health`

Never commit `.env` files or use the demo credentials in a public deployment.
