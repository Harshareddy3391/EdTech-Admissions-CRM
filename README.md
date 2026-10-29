# EdTech CRM & Student Admissions Inquiry System

A full-stack, enterprise-grade EdTech CRM and Inquiry Management platform designed for modern educational academies, coding bootcamps, and universities. This system bridges prospective student admissions inquiry capture with an interactive multi-stage admissions counseling pipeline, automated lead scoring, counselor workload management, conversion analytics, and complete database persistence.

---

## 🌟 Live Deployed Application

- **Live Application URL**: [https://ais-dev-p4janbs4mbdujfhzeoidao-740955152646.asia-east1.run.app](https://ais-dev-p4janbs4mbdujfhzeoidao-740955152646.asia-east1.run.app)
- **Interactive Deliverables & API Tester**: Accessible directly within the deployed application via the **"Deliverables & Package"** tab.

---

## 📋 Evaluation Deliverables Checklist

| Deliverable | Location | Status | Description |
| :--- | :--- | :---: | :--- |
| **Frontend & Backend Repository** | Root repository (`src/` + `backend/`) | ✅ Complete | Modular React.js frontend + Python FastAPI REST backend. |
| **schema.sql Database File** | `/schema.sql` | ✅ Complete | ANSI SQL DDL with constraints, foreign keys, indexes & seed data. |
| **.env.example File** | `/.env.example` | ✅ Complete | Exhaustive environment variable templates with descriptions. |
| **README.md** | `/README.md` | ✅ Complete | Architecture, setup guide, testing instructions, and API docs. |
| **Live Deployed Application Link** | Cloud Run Service | ✅ Complete | 100% interactive live app accessible online. |

---

## 🛠️ Technology Stack

### Frontend
- **React.js 19**: Modern functional components, custom hooks, and reactive UI state.
- **Vite 8**: Ultra-fast frontend build tooling and ESM development server.
- **Bootstrap 5 & Custom CSS**: Responsive 12-column grid system, cards, modal drawers, form validation states, and typography.
- **Lucide React**: Clean, accessible vector icons for admissions stages and touchpoints.

### Backend
- **Python 3.10+**: Core programming language.
- **FastAPI 0.115+**: Asynchronous, high-performance web framework with OpenAPI `/docs`.
- **Pydantic v2**: Strict request validation, data serialization, and response schemas.
- **SQLAlchemy 2.0+**: Enterprise Object-Relational Mapper (ORM) with session dependencies.
- **Uvicorn**: Lightning-fast ASGI production web server.

### Database
- **Standard SQL / PostgreSQL / SQLite**: Normalized relational schema with strict foreign key integrity, cascade rules, and query indexes.
- **`schema.sql`**: Production DDL script containing `courses`, `counselors`, `inquiries`, `inquiry_activities`, and `follow_up_tasks`.

---

## 🏗️ System Architecture & Entity Relationships

```
┌────────────────────────────────────────────────────────────────────────┐
│                              COURSES                                   │
│  id (PK) · code · title · department · tuition_fee · enrolled_seats   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ 1:N
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             INQUIRIES                                  │
│  id (PK) · tracking_code · student_name · email · phone · stage        │
│  course_id (FK) · assigned_counselor_id (FK) · lead_score · budget    │
└───────────┬────────────────────────────────────────────────┬───────────┘
            │ 1:N                                            │ 1:N
            ▼                                                ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐
│      INQUIRY ACTIVITIES       │        │        FOLLOW UP TASKS        │
│  id (PK) · activity_type      │        │  id (PK) · due_date · priority│
│  summary · outcome · created  │        │  title · is_completed        │
└───────────────────────────────┘        └───────────────────────────────┘
                                ▲
                                │ N:1
┌───────────────────────────────┴────────────────────────────────────────┐
│                             COUNSELORS                                 │
│  id (PK) · name · email · phone · role · active_leads_count · target   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```
edtech-crm/
├── backend/
│   ├── main.py                  # FastAPI root application entry point
│   ├── database.py              # SQLAlchemy engine & session dependency
│   ├── models.py                # Database ORM models
│   ├── schemas.py               # Pydantic validation schemas
│   ├── requirements.txt         # Python package dependencies
│   └── routers/
│       ├── courses.py           # /api/courses endpoints
│       ├── counselors.py        # /api/counselors endpoints
│       ├── inquiries.py         # /api/inquiries CRUD & stage transitions
│       └── analytics.py         # /api/analytics funnel calculations
├── src/
│   ├── components/              # React Bootstrap components
│   │   ├── NavigationHeader.tsx # 3-zone brand and view switcher
│   │   ├── PublicInquiryForm.tsx# Prospective student discovery & form
│   │   ├── KanbanPipeline.tsx   # 6-stage admissions pipeline
│   │   ├── InquiriesTable.tsx   # High-density data grid & filter
│   │   ├── LeadDetailModal.tsx  # Student profile, scoring & activity log
│   │   ├── AnalyticsDashboard.tsx # Funnel drop-off & counselor metrics
│   │   ├── CoursesCatalog.tsx   # Cohort dates, fees, and seat capacity
│   │   └── DeliverablesViewer.tsx # In-app schema, code & API inspector
│   ├── services/
│   │   └── api.ts               # REST client & persistent storage engine
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces matching Pydantic
│   ├── App.tsx                  # Root application view orchestration
│   ├── main.tsx                 # React DOM mount point
│   └── index.css                # Bootstrap custom variables & styling
├── schema.sql                   # Standalone DDL database script
├── .env.example                 # Environment variables specification
├── package.json                 # Node.js dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
└── README.md                    # Project documentation & setup guide
```

---

## 🚀 Setup & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- **Python**: 3.10 or higher
- **pip** and `python3-venv`

---

### 1. Database Setup (`schema.sql`)

#### Option A: PostgreSQL
```bash
# Create the database in PostgreSQL
createdb edtech_crm_db

# Execute the schema.sql DDL script
psql -d edtech_crm_db -f schema.sql
```

#### Option B: SQLite
```bash
# Execute schema.sql to initialize edtech_crm.db with tables & sample seeds
sqlite3 edtech_crm.db < schema.sql
```

---

### 2. Backend Setup (Python & FastAPI)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Configure environment variables
cp ../.env.example ../.env

# 5. Run the FastAPI development server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend will now be active at **`http://localhost:8000`** with interactive Swagger documentation at **`http://localhost:8000/docs`**.

---

### 3. Frontend Setup (React.js, Vite & Bootstrap)

```bash
# 1. From the repository root, install Node dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
The React frontend will be accessible at **`http://localhost:3000`**.

---

## 🔌 API Specification & Sample Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/courses` | List all active bootcamps, fees, and seat availability. |
| `POST` | `/api/inquiries` | Submit student inquiry; computes score & assigns counselor. |
| `GET` | `/api/inquiries` | Retrieve inquiries with stage, course, and text search filters. |
| `GET` | `/api/inquiries/{id}` | Detailed inquiry record with full activity timeline. |
| `PATCH` | `/api/inquiries/{id}/stage` | Advance inquiry stage across the admissions funnel. |
| `PATCH` | `/api/inquiries/{id}/counselor` | Reassign lead to a different admissions counselor. |
| `POST` | `/api/inquiries/{id}/activities` | Log a counselor touchpoint (Call, WhatsApp, Email, Note). |
| `GET` | `/api/inquiries/track/{code}` | Public portal status lookup via tracking code. |
| `GET` | `/api/counselors` | List all counselors with workload and conversion metrics. |
| `GET` | `/api/analytics` | Admissions funnel conversions, source ROI, and revenue pipeline. |

### Sample Inquiry Submission (`POST /api/inquiries`)
```json
{
  "student_name": "Rohan Sharma",
  "email": "rohan.sharma@example.com",
  "phone": "+1 (555) 349-1102",
  "city": "San Francisco, CA",
  "highest_qualification": "B.S. in Computer Science",
  "current_status": "Final Year Student",
  "course_id": "crs_01",
  "preferred_batch": "Weekend Intensive",
  "lead_source": "Website Inquiry Form",
  "tuition_budget": "Self-Funded / Immediate",
  "scholarship_applied": true,
  "notes": "Looking to transition into Full-Stack Software Engineering."
}
```

---

## 🎯 Lead Scoring Methodology

Lead scores are computed dynamically from four weighted dimensions (0–100):
1. **Academic Readiness (25%)**: Background in STEM, engineering, or relevant diplomas.
2. **Urgency & Timing (25%)**: Immediate cohort preference vs. deferred timing.
3. **Financial Readiness (25%)**: Self-funded / employer-sponsored vs. loan-dependent.
4. **Counselor Engagement (25%)**: Response history, attended counseling demo, or transcript submission.

---

## 🧪 Testing Instructions

### 1. Manual Testing Scenarios
1. **Public Lead Capture**: Open the **Inquiry Form** view, select a course, fill in student details, and submit. Verify that an `INQ-2026-XXXX` tracking code is generated and that the lead appears in the **Admissions Pipeline**.
2. **Stage Progression**: Switch to the **Admissions Pipeline** tab. Drag a lead card from *New Inquiry* to *Contacted* or *Counseling Scheduled*. Verify that the stage updates instantly and an activity log is created.
3. **Counselor Touchpoint Logging**: Click any lead card to open the **Lead Dossier**. Add a Call Note or WhatsApp update. Verify that the touchpoint is recorded in the activity timeline.
4. **Student Tracking**: Use the **Track Inquiry** box with tracking code `INQ-2026-8821` to view the live status from a student's perspective.
5. **Analytics & Funnel Verification**: Open the **Analytics** tab to inspect the conversion drop-off percentages and counselor performance metrics.
6. **Deliverables Export**: Navigate to the **Deliverables & Package** tab. Preview `schema.sql` and click **"Download schema.sql"** to verify file integrity.

### 2. Automated Backend Testing (FastAPI)
```bash
# Run pytest on the backend test suite
pytest backend/tests/ -v
```

---

## 📄 License & Attribution
Developed for the Full-Stack Assessment Task: EdTech CRM & Admissions Inquiry System. Licensed under the Apache-2.0 License.
