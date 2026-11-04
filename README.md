# Plan Reminder

A full-stack license and subscription expiry tracker. It sends automated email reminders before domains, SSL certificates, server licenses, and other critical assets expire.

Built for small teams managing a **shared list** of assets who need reliable reminders before something breaks.

**Stack:** Node.js · Express · MongoDB · React · Vite


## Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)


## Features

- **JWT Authentication** — Secure login with hashed passwords (`bcryptjs`) and stateless tokens.
- **Role-Based Access** — Admins manage categories and all plans; owners see only their own.
- **Category-Based Reminders** — Each category defines its own schedule, e.g. `[30, 14, 7, 3, 2, 1]` days before expiry.
- **Idempotent Reminder Engine** — A unique compound index on `ReminderLog(plan, expiryDate, intervalDays)` prevents duplicate emails.
- **Daily Cron Job** — Runs at 8:00 AM in a configured timezone (`CRON_TZ`).
- **Urgency-Tiered Emails** — Subject and body change based on days remaining (`Heads up` → `Reminder` → `⚠️` → `🚨 URGENT`).
- **Computed Status** — Active / Expiring / Expired / Cancelled, derived from `expiryDate` (never stored).


## 🏗 Architecture
┌─────────────────┐ ┌──────────────────────┐
│ React Client │────────▶│ Express Backend │
│ (Vite) │ HTTPS │ (Node.js) │
└─────────────────┘ └──────────┬───────────┘
│
┌────────────┼────────────┐
│ │ │
┌─────▼─────┐ ┌────▼────┐ ┌─────▼───────┐
│ MongoDB │ │ SMTP │ │ Cron Job │
│ Atlas │ │ Provider│ │ (in-process)│
└───────────┘ └─────────┘ └─────────────┘


**Key design decisions:**

- **Service layer** separates business logic from HTTP. The cron job and controllers share the same code via `services/`, so ownership rules are enforced once.
- **Status is computed, never stored.** `utils/planStatus.js` is imported by both the server and the React client, so they can never disagree.
- **`ReminderLog` is the source of idempotency.** The cron can run twice; the second run skips.
- **Timezone-pinned cron.** `CRON_TZ` in `.env` ensures the job fires at 8 AM local time, not UTC.

---

## 🚀 Quick Start

### Prerequisites

- Node.js **v20+**
- npm **v10+**
- MongoDB instance (Atlas or local)
- SMTP credentials (optional in development — emails print to the console)

### Install

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/plan-reminder-app.git
cd plan-reminder-app

# Backend
cd server && npm install

# Frontend
cd ../client && npm install

cd server
cp .env.example .env

# Create the initial admin user and default categories
cd server
node src/seed/seed.js

# Terminal 1 — Backend (http://localhost:4777)
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

### Project Structure
```

plan-reminder-app/
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── api/client.js            # Axios + JWT interceptor
│       ├── context/AuthContext.jsx  # Login state
│       ├── pages/                   # Login, Plans, PlanForm
│       └── components/              # ProtectedRoute, PlanTable, StatusBadge
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/                  # db.js, env.js (validated)
│   │   ├── models/                  # User, Category, Plan, ReminderLog
│   │   ├── services/                # planService, reminderService, emailService
│   │   ├── controllers/             # HTTP handlers
│   │   ├── middleware/              # auth, requireRole, loadPlan, errorHandler
│   │   ├── routes/                  # Express route definitions
│   │   ├── jobs/dailyReminder.js    # node-cron scheduler
│   │   ├── utils/                   # dates, planStatus, ApiError
│   │   ├── app.js                   # Express app (no listen — importable for tests)
│   │   └── server.js                # Entry point (listen + cron)
│   ├── tests/                       # node --test
│   └── package.json
│
├── .env.example
└── README.md

## Testing

cd server
npm test
```
