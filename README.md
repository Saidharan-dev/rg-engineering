# RG Engineering Excellence — Full Stack Project

**Stack:** SQL (MySQL) · Express.js · React · Node.js (SERN)

---

## Project Structure

```
rg-engineering/
├── server/          → Express + Node.js API (port 3001)
├── client/          → Public website React app (port 5173)  ← next step
└── admin/           → Admin panel React app (port 5174)
```

---

## 1. Database Setup (MySQL)

```bash
# Log into MySQL
mysql -u root -p

# Run the schema file
source /path/to/rg-engineering/server/schema.sql
```

This creates:
- `projects` table (seeded with 21 real projects)
- `enquiries` table
- `admin_users` table (default login: admin / admin123)

---

## 2. Server Setup

```bash
cd server

# Copy env file and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Run in development
npm run dev
```

**Fill in `.env`:**
- `DB_PASSWORD` — your MySQL password
- `JWT_SECRET` — any long random string
- `EMAIL_USER` — your Gmail address
- `EMAIL_PASS` — Gmail App Password (not your regular password)
  → Go to Google Account → Security → 2-Step Verification → App Passwords
- `EMAIL_TO` — where enquiries get emailed (gstruds@yahoo.com)

**API Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | ✗ | Admin login |
| GET | /api/auth/me | ✓ | Verify token |
| GET | /api/projects | ✗ | Get all projects |
| POST | /api/projects | ✓ | Add project |
| PUT | /api/projects/:id | ✓ | Update project |
| DELETE | /api/projects/:id | ✓ | Delete project |
| POST | /api/contact | ✗ | Submit enquiry (public) |
| GET | /api/enquiries | ✓ | Get enquiries (filter by status) |
| GET | /api/enquiries/stats | ✓ | Dashboard counts |
| POST | /api/enquiries/:id/reply | ✓ | Reply + mark as answered |

---

## 3. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
# Opens at http://localhost:5174
```

**Default login:** `admin` / `admin123`
> Change the password in production by hashing a new one with bcrypt.

**Admin panel pages:**
- `/` — Dashboard (stats + recent pending enquiries)
- `/projects` — Add / Edit / Delete projects with category filter
- `/enquiries` — Two tabs:
  - **Received / Pending** — click any enquiry, type a reply, hit Send → emails the customer + marks as answered
  - **Answered** — read-only history of all replied enquiries

---

## 4. Public Site Setup (Next step)

```bash
cd client
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Interview Talking Points

1. **JWT Auth flow** — token stored in localStorage, attached via Axios interceptor, verified server-side with middleware
2. **Protected routes** — React `ProtectedRoute` component checks auth context before rendering
3. **RESTful API design** — consistent routes, proper HTTP methods, status codes
4. **Email on two events** — enquiry submission (notify admin + ack to customer) AND reply (send reply to customer)
5. **Status management** — `pending` → `answered` transition only via reply, prevents double-replies
6. **Connection pooling** — mysql2 pool handles concurrent requests efficiently
7. **CORS configuration** — only whitelisted origins (client + admin) can hit the API
