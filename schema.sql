-- ============================================================================
-- EdTech CRM & Student Admissions Inquiry System - Database Schema
-- Dialect: Standard ANSI SQL (Compatible with PostgreSQL, SQLite, MySQL 8.0+)
-- Author: Full-Stack Engineering Team
-- ============================================================================

-- Drop tables in reverse order of foreign key dependencies if re-executing
DROP TABLE IF EXISTS follow_up_tasks;
DROP TABLE IF EXISTS inquiry_activities;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS counselors;
DROP TABLE IF EXISTS courses;

-- ----------------------------------------------------------------------------
-- 1. COURSES TABLE
-- Represents academic bootcamps, master tracks, and certification programs.
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'Beginner to Intermediate',
    duration_weeks INT NOT NULL CHECK (duration_weeks > 0),
    tuition_fee DECIMAL(10, 2) NOT NULL CHECK (tuition_fee >= 0),
    max_seats INT NOT NULL DEFAULT 40,
    enrolled_seats INT NOT NULL DEFAULT 0 CHECK (enrolled_seats >= 0),
    next_cohort_date DATE NOT NULL,
    delivery_mode VARCHAR(50) NOT NULL DEFAULT 'Hybrid / Live Online',
    prerequisites TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. COUNSELORS TABLE
-- Admissions representatives handling lead assignment, counseling, and enrollment.
-- ----------------------------------------------------------------------------
CREATE TABLE counselors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Senior Admissions Counselor',
    department VARCHAR(100) NOT NULL DEFAULT 'Admissions & Student Success',
    target_enrollments INT NOT NULL DEFAULT 15,
    active_leads_count INT NOT NULL DEFAULT 0,
    avatar_color VARCHAR(20) NOT NULL DEFAULT '#1e3a8a',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. INQUIRIES TABLE
-- Prospective student admissions leads flowing through the funnel stages.
-- Stages: NEW, CONTACTED, COUNSELING_SCHEDULED, APPLICATION_SUBMITTED, ENROLLED, DROPPED
-- ----------------------------------------------------------------------------
CREATE TABLE inquiries (
    id VARCHAR(36) PRIMARY KEY,
    tracking_code VARCHAR(30) NOT NULL UNIQUE,
    student_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    city VARCHAR(100) NOT NULL,
    highest_qualification VARCHAR(100) NOT NULL,
    current_status VARCHAR(80) NOT NULL DEFAULT 'Final Year Student',
    course_id VARCHAR(36) NOT NULL,
    preferred_batch VARCHAR(50) NOT NULL DEFAULT 'Weekend Intensive',
    lead_source VARCHAR(60) NOT NULL DEFAULT 'Website Inquiry Form',
    stage VARCHAR(40) NOT NULL DEFAULT 'NEW',
    lead_score INT NOT NULL DEFAULT 50 CHECK (lead_score BETWEEN 0 AND 100),
    assigned_counselor_id VARCHAR(36),
    tuition_budget VARCHAR(50) NOT NULL DEFAULT 'Self-Funded / Immediate',
    scholarship_applied BOOLEAN NOT NULL DEFAULT FALSE,
    demo_scheduled_at TIMESTAMP NULL,
    enrolled_at TIMESTAMP NULL,
    dropped_reason TEXT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inquiries_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inquiries_counselor FOREIGN KEY (assigned_counselor_id) 
        REFERENCES counselors(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 4. INQUIRY ACTIVITIES TABLE
-- Audit log of all counselor student touchpoints (Calls, WhatsApp, Demos, Emails).
-- ----------------------------------------------------------------------------
CREATE TABLE inquiry_activities (
    id VARCHAR(36) PRIMARY KEY,
    inquiry_id VARCHAR(36) NOT NULL,
    counselor_id VARCHAR(36),
    activity_type VARCHAR(40) NOT NULL, -- CALL, EMAIL, WHATSAPP, COUNSELING_DEMO, NOTE, STATUS_CHANGE
    summary VARCHAR(255) NOT NULL,
    details TEXT,
    outcome VARCHAR(80),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_inquiry FOREIGN KEY (inquiry_id) 
        REFERENCES inquiries(id) ON DELETE CASCADE,
    CONSTRAINT fk_activities_counselor FOREIGN KEY (counselor_id) 
        REFERENCES counselors(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. FOLLOW UP TASKS TABLE
-- Actionable reminders for counselors to prevent lead drop-off.
-- ----------------------------------------------------------------------------
CREATE TABLE follow_up_tasks (
    id VARCHAR(36) PRIMARY KEY,
    inquiry_id VARCHAR(36) NOT NULL,
    counselor_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_inquiry FOREIGN KEY (inquiry_id) 
        REFERENCES inquiries(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_counselor FOREIGN KEY (counselor_id) 
        REFERENCES counselors(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ----------------------------------------------------------------------------
CREATE INDEX idx_inquiries_stage ON inquiries(stage);
CREATE INDEX idx_inquiries_course_id ON inquiries(course_id);
CREATE INDEX idx_inquiries_counselor_id ON inquiries(assigned_counselor_id);
CREATE INDEX idx_inquiries_tracking_code ON inquiries(tracking_code);
CREATE INDEX idx_inquiries_lead_source ON inquiries(lead_source);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_activities_inquiry_id ON inquiry_activities(inquiry_id);
CREATE INDEX idx_tasks_counselor_due ON follow_up_tasks(counselor_id, due_date, is_completed);

-- ============================================================================
-- SEED DATA: Realistic Academic Courses, Admissions Counselors & Inquiries
-- ============================================================================

INSERT INTO courses (id, code, title, department, level, duration_weeks, tuition_fee, max_seats, enrolled_seats, next_cohort_date, delivery_mode, prerequisites) VALUES
('crs_01', 'FSD-201', 'Full-Stack Software Engineering Bootcamp', 'Computer Science', 'Beginner to Advanced', 24, 4500.00, 35, 28, '2026-11-15', 'Live Online & Mentorship', 'Basic programming logic; High school diploma or equivalent.'),
('crs_02', 'AIML-301', 'Applied AI & Machine Learning Engineering', 'Data & AI', 'Intermediate', 20, 5200.00, 30, 22, '2026-11-20', 'Hybrid Campus & Virtual', 'Python proficiency & basic linear algebra.'),
('crs_03', 'CLD-105', 'Cloud Architecture & DevOps Masterclass', 'Cloud & Systems', 'Intermediate to Advanced', 16, 3800.00, 40, 31, '2026-12-01', 'Live Online Weekend', 'Linux fundamentals and basic networking.'),
('crs_04', 'CYB-401', 'Cyber Security & Ethical Hacking Fellowship', 'Security & Infrastructure', 'Beginner to Intermediate', 18, 4100.00, 25, 17, '2026-11-25', 'Live Online Intensive', 'Familiarity with computer networks and operating systems.'),
('crs_05', 'UXD-102', 'Product Design (UI/UX) & Design Systems', 'Design & Product', 'All Levels Welcome', 14, 3200.00, 30, 24, '2026-11-18', 'Virtual Interactive Studio', 'Creative curiosity; portfolio submission optional.');

INSERT INTO counselors (id, name, email, phone, role, department, target_enrollments, active_leads_count, avatar_color) VALUES
('cns_01', 'Priya Sharma', 'priya.sharma@edtech.edu', '+1 (555) 234-8901', 'Senior Admissions Counselor', 'Tech Bootcamps', 18, 14, '#1e3a8a'),
('cns_02', 'Marcus Vance', 'marcus.vance@edtech.edu', '+1 (555) 345-6712', 'Lead Academic Advisor', 'AI & Cloud Programs', 20, 16, '#0f766e'),
('cns_03', 'Elena Rostova', 'elena.rostova@edtech.edu', '+1 (555) 456-7823', 'Admissions Specialist', 'Design & Product Careers', 15, 11, '#b45309'),
('cns_04', 'David Chen', 'david.chen@edtech.edu', '+1 (555) 567-8934', 'Admissions Representative', 'Enterprise & Scholarships', 16, 12, '#4338ca');

INSERT INTO inquiries (id, tracking_code, student_name, email, phone, city, highest_qualification, current_status, course_id, preferred_batch, lead_source, stage, lead_score, assigned_counselor_id, tuition_budget, scholarship_applied, demo_scheduled_at, enrolled_at, dropped_reason, notes, created_at) VALUES
('inq_01', 'INQ-2026-8821', 'Aarav Patel', 'aarav.patel@example.com', '+1 (555) 019-2831', 'Seattle, WA', 'B.S. in Mechanical Eng', 'Career Switcher', 'crs_01', 'Weekend Intensive', 'Google Search (Admissions)', 'NEW', 88, 'cns_01', 'Self-Funded / Immediate', TRUE, NULL, NULL, NULL, 'Strong aptitude in mathematics; looking to transition into full-stack SaaS engineering within 6 months.', '2026-10-26 14:22:00'),
('inq_02', 'INQ-2026-7319', 'Sophia Martinez', 'sophia.m@example.com', '+1 (555) 912-3847', 'Austin, TX', 'B.A. in Psychology', 'Working Professional', 'crs_05', 'Weekday Evening', 'LinkedIn Campaign', 'CONTACTED', 76, 'cns_03', 'Company Sponsorship', FALSE, NULL, NULL, NULL, 'Spoke via telephone for 15 minutes. Interested in product design transitions; sent program syllabus PDF.', '2026-10-24 10:15:00'),
('inq_03', 'INQ-2026-6412', 'Michael Thorne', 'm.thorne@example.com', '+1 (555) 782-9912', 'Boston, MA', 'B.S. in Computer Science', 'Recent Graduate', 'crs_02', 'Full-time Bootcamp', 'Campus Recruitment Drive', 'COUNSELING_SCHEDULED', 94, 'cns_02', 'Self-Funded / Immediate', TRUE, '2026-11-02 16:00:00', NULL, NULL, 'Attended university seminar; scheduled 1-on-1 counseling demo with AI faculty on Nov 2nd.', '2026-10-25 11:30:00'),
('inq_04', 'INQ-2026-5503', 'Nadia Al-Mansoor', 'nadia.almansoor@example.com', '+1 (555) 438-2291', 'Chicago, IL', 'B.S. in Information Tech', 'IT Support Specialist', 'crs_03', 'Weekend Intensive', 'Alumni Referral', 'APPLICATION_SUBMITTED', 92, 'cns_02', 'Tuition Installment Plan', FALSE, '2026-10-22 15:00:00', NULL, NULL, 'Completed counseling demo session. Official application submitted, currently verifying academic transcripts.', '2026-10-21 09:45:00'),
('inq_05', 'INQ-2026-4290', 'Liam O''Connor', 'liam.oc@example.com', '+1 (555) 662-7719', 'Denver, CO', 'High School Diploma + Bootcamp', 'Junior Developer', 'crs_01', 'Weekday Evening', 'Direct Website Visit', 'ENROLLED', 98, 'cns_01', 'Self-Funded / Immediate', FALSE, '2026-10-18 11:00:00', '2026-10-26 16:30:00', NULL, 'Seat confirmed for Nov 15 cohort. Tuition down payment processed, welcome onboarding packet sent.', '2026-10-17 13:00:00'),
('inq_06', 'INQ-2026-3811', 'Jason Miller', 'jmiller99@example.com', '+1 (555) 321-4456', 'Atlanta, GA', 'Associate Degree in Business', 'Sales Associate', 'crs_04', 'Weekend Intensive', 'Instagram Sponsored Post', 'DROPPED', 35, 'cns_04', 'Undecided / Needs Loan', FALSE, NULL, NULL, 'Relocating to another city; deferred academic training to Q3 2027.', 'Followed up twice; candidate requested file closure for current calendar year.', '2026-10-19 16:20:00'),
('inq_07', 'INQ-2026-9104', 'Zoya Khan', 'zoya.k@example.com', '+1 (555) 554-1182', 'New York, NY', 'B.S. in Statistics', 'Data Analyst', 'crs_02', 'Weekday Evening', 'Google Search (Admissions)', 'COUNSELING_SCHEDULED', 85, 'cns_02', 'Self-Funded / Immediate', FALSE, '2026-11-03 14:00:00', NULL, NULL, 'Wants to level up into ML engineering & PyTorch deployment. Counseling session confirmed for Nov 3rd.', '2026-10-27 15:40:00'),
('inq_08', 'INQ-2026-2917', 'Lucas Garcia', 'lgarcia@example.com', '+1 (555) 887-3421', 'San Jose, CA', 'B.A. in Digital Arts', 'Graphic Designer', 'crs_05', 'Weekend Intensive', 'Dribbble Partnership', 'CONTACTED', 72, 'cns_03', 'Tuition Installment Plan', TRUE, NULL, NULL, NULL, 'Sent curriculum breakdown. Asked about scholarship evaluation criteria and design mentor pairing.', '2026-10-25 17:10:00');

INSERT INTO inquiry_activities (id, inquiry_id, counselor_id, activity_type, summary, details, outcome, created_at) VALUES
('act_01', 'inq_01', 'cns_01', 'STATUS_CHANGE', 'Lead Created via Public Portal', 'Prospective student submitted online inquiry for Full-Stack Software Engineering Bootcamp.', 'Success', '2026-10-26 14:22:00'),
('act_02', 'inq_02', 'cns_03', 'CALL', 'Introductory Counseling Discovery Call', 'Detailed 15-minute consultation reviewing UX curriculum and career outcomes.', 'High Interest', '2026-10-24 14:30:00'),
('act_03', 'inq_03', 'cns_02', 'WHATSAPP', 'Demo Schedule Confirmation', 'Sent Zoom invitation link and syllabus checklist for upcoming ML counseling demo.', 'Confirmed', '2026-10-25 12:00:00'),
('act_04', 'inq_04', 'cns_02', 'COUNSELING_DEMO', '1-on-1 Academic Counseling Session', 'Reviewed DevOps curriculum, lab environment access, and installment options.', 'Submitted App', '2026-10-22 15:00:00'),
('act_05', 'inq_05', 'cns_01', 'STATUS_CHANGE', 'Enrollment Confirmed & Seat Reserved', 'Tuition down payment verified. Student officially admitted into Cohort Nov-15.', 'Enrolled', '2026-10-26 16:30:00');

INSERT INTO follow_up_tasks (id, inquiry_id, counselor_id, title, due_date, priority, is_completed, created_at) VALUES
('tsk_01', 'inq_01', 'cns_01', 'Call Aarav Patel to discuss scholarship eligibility', '2026-10-29', 'HIGH', FALSE, '2026-10-26 15:00:00'),
('tsk_02', 'inq_02', 'cns_03', 'Follow up with Sophia regarding company sponsorship approval', '2026-10-30', 'MEDIUM', FALSE, '2026-10-24 11:00:00'),
('tsk_03', 'inq_04', 'cns_02', 'Review academic transcripts & issue formal offer letter', '2026-10-29', 'URGENT', FALSE, '2026-10-23 10:00:00');
