# EdTech CRM & Student Admissions Inquiry System

A comprehensive, production-grade EdTech CRM and Inquiry Management platform designed for educational institutions, bootcamps, and universities. This system unifies student lead capture, multi-stage admissions counseling, automated lead scoring, counselor workload management, conversion analytics, and assessment deliverable packaging (`schema.sql`, `.env.example`, `README.md`, Python FastAPI backend, and live API endpoints).

> [!IMPORTANT]
> **Confirmed Choices & Tech Stack**:
> - **Frontend**: **React.js** built with **Vite**, styled using **Bootstrap 5** responsive grid & components, custom **CSS**, and **Lucide React** icons.
> - **Backend**: **Python 3.10+ with FastAPI** (`pydantic`, `SQLAlchemy`, `uvicorn`), structured with clean modular routers (`/api/inquiries`, `/api/counselors`, `/api/courses`, `/api/activities`, `/api/analytics`).
> - **Database & DDL**: Production-grade `schema.sql` (PostgreSQL / SQLite compatible) with tables, relationships, foreign key constraints, indexes, and comprehensive seed data.
> - **Deliverables Package**: Complete repository assets including root `schema.sql`, `.env.example`, `README.md`, standalone `/backend/` Python FastAPI package, and interactive in-app code and schema explorer.
> - **Pipeline Model**: Full Admissions Funnel (New Inquiry → Contacted → Demo / Counseling Scheduled → Application Submitted → Enrolled → Dropped).

---

## 1. Technology Stack Breakdown

| Layer | Technology | Specifications | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React.js** | `19.0.1` | Component-based interactive UI with standard hooks (`useState`, `useMemo`, `useCallback`, `useEffect`). |
| **Frontend Build Tool** | **Vite** | `8.3.0` | High-performance ESM bundler and development server. |
| **Styling & UI Library** | **Bootstrap 5 & Custom CSS** | `5.3+` | Industry-standard Bootstrap responsive grid system, cards, forms, tables, modals, badges, and layout utilities paired with clean custom CSS. |
| **Iconography** | **Lucide React** | `0.546.0` | Accessible, minimalist vector icons for status states, touchpoints, and navigation. |
| **Backend API** | **Python & FastAPI** | `FastAPI 0.115+`, `Pydantic v2` | High-performance, asynchronous REST API with OpenAPI documentation, type validation, and dependency injection. |
| **Backend Server** | **Uvicorn / ASGI** | `uvicorn[standard]` | Lightning-fast ASGI production server for the Python FastAPI service. |
| **ORM / Data Access** | **SQLAlchemy** | `SQLAlchemy 2.0+` | Enterprise ORM mapping data models to relational tables with transaction safety. |
| **SQL Deliverable** | **schema.sql** | PostgreSQL / SQLite DDL | Standard SQL script defining tables, foreign keys, constraints, and initial admissions seeds. |
| **Config & Secrets** | **dotenv** / **.env.example** | Standard ENV format | Standardized environment configurations for database URLs, port mappings, and API base paths. |

---

## 2. Overview & Core Concept

### What It Does
The EdTech CRM & Inquiry System bridges prospective students with admissions counseling teams:
1. **Prospective Students**: Explore career-focused programs (Full-Stack Engineering, Data Science & AI, Cloud DevOps, Cyber Security, UX/UI Design), check eligibility and tuition, submit comprehensive inquiries via a clean Bootstrap form, and track their application progress with a unique inquiry tracking code (`INQ-2026-XXXX`).
2. **Admissions Counselors & Admins**: Track student inquiries through a visual drag-and-drop Kanban pipeline and high-density Bootstrap data table, auto-score leads based on commitment readiness and background fit, schedule demo sessions, log touchpoints (calls, WhatsApp, email, meetings), reassign counselors, and monitor revenue and enrollment conversion rates.
3. **Assessment Reviewers**: Directly view and test the required submission deliverables (`schema.sql`, `.env.example`, `README.md`, FastAPI backend code, live API endpoints, test suite) via a dedicated "Deliverables & Submission Package" panel within the app.

---

## 3. Backend & Repository Architecture (Python FastAPI)

```
edtech-crm/
├── backend/
│   ├── main.py                  # FastAPI application entry point, CORS, routers
│   ├── database.py              # SQLAlchemy engine, session maker, Base
│   ├── models.py                # ORM models (Course, Counselor, Inquiry, Activity, Task)
│   ├── schemas.py               # Pydantic request & response schemas
│   ├── requirements.txt         # fastapi, uvicorn, sqlalchemy, pydantic, python-dotenv
│   └── routers/
│       ├── inquiries.py         # CRUD, status transitions, lead scoring
│       ├── counselors.py        # Counselor listings, assignment, workload
│       ├── courses.py           # Course catalog, seats, tuition
│       ├── activities.py        # Activity logs (calls, emails, demo notes)
│       └── analytics.py         # Conversion funnel, source attribution, SLA metrics
├── schema.sql                   # Standalone DDL + seed data for PostgreSQL / SQLite
├── .env.example                 # Environment variables specification
├── README.md                    # Setup, architecture, API docs & testing instructions
├── src/                         # React.js + Bootstrap frontend application
└── package.json                 # Node.js frontend configuration
```

### FastAPI API Endpoints Specification
- `GET /api/courses` — List all active programs, tuition fees, cohort dates, and seat availability.
- `POST /api/inquiries` — Public endpoint to submit a student admissions inquiry (generates `tracking_code`, computes initial lead score).
- `GET /api/inquiries` — List inquiries with filtering by stage, course, counselor, and text search.
- `GET /api/inquiries/{id}` — Get lead details with related activities, notes, and counselor details.
- `PATCH /api/inquiries/{id}/stage` — Advance inquiry stage (Kanban drag-and-drop or dropdown).
- `PATCH /api/inquiries/{id}/counselor` — Reassign lead to a counselor.
- `POST /api/inquiries/{id}/activities` — Log a touchpoint (Call, WhatsApp, Email, Counseling Demo, Note).
- `GET /api/inquiries/track/{tracking_code}` — Student portal public status lookup.
- `GET /api/counselors` — List counselors with active lead counts and targets.
- `GET /api/analytics` — Funnel drop-off breakdown, lead sources, and counselor performance.

---

## 4. Frontend & User Experience Design (React + Bootstrap 5 + CSS)

### Key Views
1. **Public Inquiry Portal**:
   - Course exploration cards with cohort details, tuition, prerequisites, and syllabus download CTA.
   - Bootstrap-styled multi-step inquiry form with validation (Student Name, Contact, Desired Course, Preferred Schedule, Educational Background, Financing interest).
   - Instant inquiry tracking code generator and public status tracker.
2. **Counselor Admissions Kanban**:
   - 6 funnel stages: *New Inquiry*, *Contacted*, *Demo / Counseling Scheduled*, *Application Submitted*, *Enrolled*, *Dropped*.
   - Bootstrap card layout showing candidate name, course, lead score badge, assigned counselor, time in stage, and last activity date.
   - Drag-and-drop and one-click quick actions.
3. **High-Density Table View**:
   - Bootstrap responsive table (`table table-hover table-striped`) with multi-column filtering (by stage, course, counselor, date range).
   - Search bar and bulk export to CSV / JSON.
4. **Lead Dossier Modal / Drawer**:
   - Contact info & student profile.
   - Weighted Lead Score breakdown (Academic Background: 25%, Timeline Urgency: 25%, Budget Readiness: 25%, Engagement: 25%).
   - Interactive activity logging (Call, Email, WhatsApp, Demo Session, Counselor Note).
   - Status advancement stepper and counselor reassignment dropdown.
5. **Analytics & Funnel Dashboard**:
   - Funnel conversion drop-off bars.
   - Lead source attribution (Google Ads, Social, College Outreach, Referrals, Organic).
   - Counselor productivity leaderboard (conversion %, response time, enrollments).
6. **Assessment Deliverables Panel**:
   - Live file viewer with copy and download buttons for `schema.sql`, `.env.example`, `README.md`, and Python FastAPI backend modules.
   - Interactive API testing console.

### Visual Styling & Theme
- Bootstrap 5 framework loaded and customized with professional CSS variables:
  - Deep Navy brand identity (`#1a365d`), slate neutral backgrounds, warm amber for follow-ups, and emerald green for enrollments.
  - Responsive Bootstrap container-fluid grid (`col-lg-3`, `col-md-6`, `col-12`).
  - Strict typography and tabular numbers (`tabular-nums`) for currency and tracking codes.

---

## 5. Implementation Sequence

1. **Install Bootstrap & Configure Styling**:
   - Include Bootstrap 5 and custom CSS for clean styling.
2. **Root Deliverables (`schema.sql`, `.env.example`, `README.md`)**:
   - Generate production-grade `schema.sql` with full DDL, constraints, foreign keys, indexes, and realistic seed data.
   - Generate detailed `.env.example` with Python FastAPI, database, and frontend environment variables.
   - Generate comprehensive `README.md` containing architecture diagrams, setup commands for both Python FastAPI backend and React frontend, API documentation, testing walkthrough, and live deployment link.
3. **Python FastAPI Backend Modules**:
   - Create `/backend/` directory with `requirements.txt`, `database.py`, `models.py`, `schemas.py`, and `main.py` + routers.
4. **Integrated Full-Stack Server & API**:
   - Implement the full-stack REST API server matching the exact FastAPI endpoint contracts so the live application deployed on Cloud Run functions interactively with full CRUD persistence.
5. **React Frontend Views**:
   - Build NavigationHeader, PublicInquiryPortal, KanbanPipeline, TableView, LeadDetailModal, AnalyticsDashboard, and AssessmentDeliverablesViewer.
6. **Verification**:
   - Run build check (`compile_applet`), verify all interactive flows, check schema export, and test lead state transitions.
