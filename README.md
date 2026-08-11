# 🏦 Full-Stack Core Ledger & Payment Processing Engine

A robust, enterprise-grade banking application designed for secure inter-account fund transfers and client lifecycle tracking [INDEX]. Built using a fully decoupled modern architecture with an asynchronous backend API layer and a highly responsive, state-aware frontend dashboard interface [INDEX].

🔗 **GitHub Repository:** https://github.com/Jayaprakash-ai/Transaction_ledger

We built a decoupled full-stack ledger application using Next.js (React) with TypeScript for the frontend, paired with a high-performance FastAPI (Python) REST API backend layer and a relational PostgreSQL database. The frontend utilizes React's state management  to capture inputs and display dynamic user interfaces like password eye-toggles, while Next.js handles file-based routing and global layout controls . TypeScript adds strict data formatting rules  to catch interface bugs instantly before compiling. On the backend, FastAPI maps data criteria to your PostgreSQL master tables using SQLAlchemy ORM, enforcing strict database atomicity to guarantee that transfer balances always roll back safely if a system failure occurs midway. Finally, we deployed native Bcrypt encryption to hash user passwords on disk and substituted plain auto-incrementing tracking keys with randomized cryptographic strings  to eliminate bulk scraping vulnerabilities. This architecture creates an incredibly fast, highly scalable, and completely secure financial ledger system that mirrors modern enterprise-grade software standards.

---

## 🛠️ Technical Stack Architecture

- **Frontend:** Next.js (React Framework), TypeScript, Tailwind CSS v4, Axios, Lucide-React [INDEX]
- **Backend:** FastAPI (Python), SQLAlchemy ORM, Pydantic v2 Validation [INDEX]
- **Database & Security:** PostgreSQL Master Cluster, Cryptographic Bcrypt Hashing, ACID Transaction Controls

---

## 📂 Project Directory Structure

```text
billing_engine/
├── backend/
│   └── app/
│       ├── routers/
│       │   ├── customers.py
│       │   └── payments.py
│       ├── crud.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       └── security.py
└── frontend/
    └── src/
        ├── components/
        │   ├── CustomerForm.tsx
        │   ├── Layout.tsx
        │   ├── Navbar.tsx
        │   └── PaymentForm.tsx
        ├── pages/
        │   ├── _app.tsx
        │   ├── customers.tsx
        │   ├── index.tsx
        │   ├── login.tsx
        │   ├── payments.tsx
        │   └── profile.tsx
        └── services/
            ├── api.ts
            ├── customers.ts
            └── payments.ts
```

---

## 🚀 Key Engineering & Security Implementation Achievements

### 🛡️ 1. Atomic Database Transaction Insulation (ACID Compliance)
To prevent data fragmentation or middle-of-the-way financial discrepancies, all inter-account transfer balance adjustments are packed inside isolated **SQLAlchemy nested transaction blocks** (`db.begin_nested()`). If a critical infrastructure failure or network dropout hits midway through processing, the entire system executes an automated `rollback()`, ensuring money never vanishes into thin air.

### 🔐 2. Enterprise-Grade Cryptographic Asset Protection
- **Bcrypt Password Encryption:** Storing passwords as plain-text is completely avoided. User registration credentials are processed into secure, unreadable mathematical hash signatures (`$2b$12$...`) using the native `bcrypt` module before hitting PostgreSQL rows.
- **Non-Sequential Receipt Generators:** Replaced trivial auto-incrementing numerical transaction indices with randomized 12-character uppercase alpha-numeric cryptographic receipt tracking codes (`TXN-XXXXXX`) to enforce data isolation and halt sequential scraping.

---

## ⚙️ Local Development Setup & Execution

### 1. Backend Service Configuration (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Dashboard Configuration (Next.js)
```bash
cd frontend
npm install
npm run dev
```
