import {
  Course,
  Counselor,
  Inquiry,
  InquiryActivity,
  FollowUpTask,
  FunnelStage,
  AnalyticsSummary,
  ActivityType,
  TaskPriority
} from '../types';

// Initial pre-seeded data mirroring schema.sql
const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_01',
    code: 'FSD-201',
    title: 'Full-Stack Software Engineering Bootcamp',
    department: 'Computer Science',
    level: 'Beginner to Advanced',
    duration_weeks: 24,
    tuition_fee: 4500,
    max_seats: 35,
    enrolled_seats: 28,
    next_cohort_date: '2026-11-15',
    delivery_mode: 'Live Online & Mentorship',
    prerequisites: 'Basic programming logic; High school diploma or equivalent.',
    is_active: true
  },
  {
    id: 'crs_02',
    code: 'AIML-301',
    title: 'Applied AI & Machine Learning Engineering',
    department: 'Data & AI',
    level: 'Intermediate',
    duration_weeks: 20,
    tuition_fee: 5200,
    max_seats: 30,
    enrolled_seats: 22,
    next_cohort_date: '2026-11-20',
    delivery_mode: 'Hybrid Campus & Virtual',
    prerequisites: 'Python proficiency & basic linear algebra.',
    is_active: true
  },
  {
    id: 'crs_03',
    code: 'CLD-105',
    title: 'Cloud Architecture & DevOps Masterclass',
    department: 'Cloud & Systems',
    level: 'Intermediate to Advanced',
    duration_weeks: 16,
    tuition_fee: 3800,
    max_seats: 40,
    enrolled_seats: 31,
    next_cohort_date: '2026-12-01',
    delivery_mode: 'Live Online Weekend',
    prerequisites: 'Linux fundamentals and basic networking.',
    is_active: true
  },
  {
    id: 'crs_04',
    code: 'CYB-401',
    title: 'Cyber Security & Ethical Hacking Fellowship',
    department: 'Security & Infrastructure',
    level: 'Beginner to Intermediate',
    duration_weeks: 18,
    tuition_fee: 4100,
    max_seats: 25,
    enrolled_seats: 17,
    next_cohort_date: '2026-11-25',
    delivery_mode: 'Live Online Intensive',
    prerequisites: 'Familiarity with computer networks and operating systems.',
    is_active: true
  },
  {
    id: 'crs_05',
    code: 'UXD-102',
    title: 'Product Design (UI/UX) & Design Systems',
    department: 'Design & Product',
    level: 'All Levels Welcome',
    duration_weeks: 14,
    tuition_fee: 3200,
    max_seats: 30,
    enrolled_seats: 24,
    next_cohort_date: '2026-11-18',
    delivery_mode: 'Virtual Interactive Studio',
    prerequisites: 'Creative curiosity; portfolio submission optional.',
    is_active: true
  }
];

const INITIAL_COUNSELORS: Counselor[] = [
  {
    id: 'cns_01',
    name: 'Priya Sharma',
    email: 'priya.sharma@edtech.edu',
    phone: '+1 (555) 234-8901',
    role: 'Senior Admissions Counselor',
    department: 'Tech Bootcamps',
    target_enrollments: 18,
    active_leads_count: 14,
    avatar_color: '#1e3a8a',
    is_active: true
  },
  {
    id: 'cns_02',
    name: 'Marcus Vance',
    email: 'marcus.vance@edtech.edu',
    phone: '+1 (555) 345-6712',
    role: 'Lead Academic Advisor',
    department: 'AI & Cloud Programs',
    target_enrollments: 20,
    active_leads_count: 16,
    avatar_color: '#0f766e',
    is_active: true
  },
  {
    id: 'cns_03',
    name: 'Elena Rostova',
    email: 'elena.rostova@edtech.edu',
    phone: '+1 (555) 456-7823',
    role: 'Admissions Specialist',
    department: 'Design & Product Careers',
    target_enrollments: 15,
    active_leads_count: 11,
    avatar_color: '#b45309',
    is_active: true
  },
  {
    id: 'cns_04',
    name: 'David Chen',
    email: 'david.chen@edtech.edu',
    phone: '+1 (555) 567-8934',
    role: 'Admissions Representative',
    department: 'Enterprise & Scholarships',
    target_enrollments: 16,
    active_leads_count: 12,
    avatar_color: '#4338ca',
    is_active: true
  }
];

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_01',
    tracking_code: 'INQ-2026-8821',
    student_name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+1 (555) 019-2831',
    city: 'Seattle, WA',
    highest_qualification: 'B.S. in Mechanical Eng',
    current_status: 'Career Switcher',
    course_id: 'crs_01',
    preferred_batch: 'Weekend Intensive',
    lead_source: 'Google Search (Admissions)',
    stage: 'NEW',
    lead_score: 88,
    assigned_counselor_id: 'cns_01',
    tuition_budget: 'Self-Funded / Immediate',
    scholarship_applied: true,
    notes: 'Strong aptitude in mathematics; looking to transition into full-stack SaaS engineering within 6 months.',
    created_at: '2026-10-26T14:22:00Z',
    updated_at: '2026-10-26T14:22:00Z',
    activities: [
      {
        id: 'act_01',
        inquiry_id: 'inq_01',
        counselor_id: 'cns_01',
        activity_type: 'STATUS_CHANGE',
        summary: 'Lead Created via Public Portal',
        details: 'Submitted inquiry for Full-Stack Software Engineering Bootcamp.',
        outcome: 'Lead Captured',
        created_at: '2026-10-26T14:22:00Z'
      }
    ],
    tasks: [
      {
        id: 'tsk_01',
        inquiry_id: 'inq_01',
        counselor_id: 'cns_01',
        title: 'Call Aarav Patel to discuss scholarship eligibility',
        due_date: '2026-10-29',
        priority: 'HIGH',
        is_completed: false,
        created_at: '2026-10-26T15:00:00Z'
      }
    ]
  },
  {
    id: 'inq_02',
    tracking_code: 'INQ-2026-7319',
    student_name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 912-3847',
    city: 'Austin, TX',
    highest_qualification: 'B.A. in Psychology',
    current_status: 'Working Professional',
    course_id: 'crs_05',
    preferred_batch: 'Weekday Evening',
    lead_source: 'LinkedIn Campaign',
    stage: 'CONTACTED',
    lead_score: 76,
    assigned_counselor_id: 'cns_03',
    tuition_budget: 'Company Sponsorship',
    scholarship_applied: false,
    notes: 'Spoke via telephone for 15 minutes. Interested in product design transitions; sent program syllabus PDF.',
    created_at: '2026-10-24T10:15:00Z',
    updated_at: '2026-10-24T14:30:00Z',
    activities: [
      {
        id: 'act_02',
        inquiry_id: 'inq_02',
        counselor_id: 'cns_03',
        activity_type: 'CALL',
        summary: 'Introductory Counseling Discovery Call',
        details: 'Detailed 15-minute consultation reviewing UX curriculum and career outcomes.',
        outcome: 'High Interest',
        created_at: '2026-10-24T14:30:00Z'
      }
    ],
    tasks: [
      {
        id: 'tsk_02',
        inquiry_id: 'inq_02',
        counselor_id: 'cns_03',
        title: 'Follow up regarding employer corporate sponsorship approval',
        due_date: '2026-10-30',
        priority: 'MEDIUM',
        is_completed: false,
        created_at: '2026-10-24T11:00:00Z'
      }
    ]
  },
  {
    id: 'inq_03',
    tracking_code: 'INQ-2026-6412',
    student_name: 'Michael Thorne',
    email: 'm.thorne@example.com',
    phone: '+1 (555) 782-9912',
    city: 'Boston, MA',
    highest_qualification: 'B.S. in Computer Science',
    current_status: 'Recent Graduate',
    course_id: 'crs_02',
    preferred_batch: 'Full-time Bootcamp',
    lead_source: 'Campus Recruitment Drive',
    stage: 'COUNSELING_SCHEDULED',
    lead_score: 94,
    assigned_counselor_id: 'cns_02',
    tuition_budget: 'Self-Funded / Immediate',
    scholarship_applied: true,
    demo_scheduled_at: '2026-11-02T16:00:00Z',
    notes: 'Attended university seminar; scheduled 1-on-1 counseling demo with AI faculty on Nov 2nd.',
    created_at: '2026-10-25T11:30:00Z',
    updated_at: '2026-10-25T12:00:00Z',
    activities: [
      {
        id: 'act_03',
        inquiry_id: 'inq_03',
        counselor_id: 'cns_02',
        activity_type: 'WHATSAPP',
        summary: 'Demo Schedule Confirmation',
        details: 'Sent Zoom invitation link and syllabus checklist for upcoming ML demo.',
        outcome: 'Confirmed',
        created_at: '2026-10-25T12:00:00Z'
      }
    ]
  },
  {
    id: 'inq_04',
    tracking_code: 'INQ-2026-5503',
    student_name: 'Nadia Al-Mansoor',
    email: 'nadia.almansoor@example.com',
    phone: '+1 (555) 438-2291',
    city: 'Chicago, IL',
    highest_qualification: 'B.S. in Information Tech',
    current_status: 'IT Support Specialist',
    course_id: 'crs_03',
    preferred_batch: 'Weekend Intensive',
    lead_source: 'Alumni Referral',
    stage: 'APPLICATION_SUBMITTED',
    lead_score: 92,
    assigned_counselor_id: 'cns_02',
    tuition_budget: 'Tuition Installment Plan',
    scholarship_applied: false,
    demo_scheduled_at: '2026-10-22T15:00:00Z',
    notes: 'Completed counseling demo session. Official application submitted, currently verifying academic transcripts.',
    created_at: '2026-10-21T09:45:00Z',
    updated_at: '2026-10-22T15:00:00Z',
    activities: [
      {
        id: 'act_04',
        inquiry_id: 'inq_04',
        counselor_id: 'cns_02',
        activity_type: 'COUNSELING_DEMO',
        summary: '1-on-1 Academic Counseling Session',
        details: 'Reviewed DevOps curriculum, lab environment access, and installment options.',
        outcome: 'Submitted App',
        created_at: '2026-10-22T15:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'tsk_03',
        inquiry_id: 'inq_04',
        counselor_id: 'cns_02',
        title: 'Review academic transcripts & issue formal offer letter',
        due_date: '2026-10-29',
        priority: 'URGENT',
        is_completed: false,
        created_at: '2026-10-23T10:00:00Z'
      }
    ]
  },
  {
    id: 'inq_05',
    tracking_code: 'INQ-2026-4290',
    student_name: 'Liam O\'Connor',
    email: 'liam.oc@example.com',
    phone: '+1 (555) 662-7719',
    city: 'Denver, CO',
    highest_qualification: 'High School Diploma + Bootcamp',
    current_status: 'Junior Developer',
    course_id: 'crs_01',
    preferred_batch: 'Weekday Evening',
    lead_source: 'Direct Website Visit',
    stage: 'ENROLLED',
    lead_score: 98,
    assigned_counselor_id: 'cns_01',
    tuition_budget: 'Self-Funded / Immediate',
    scholarship_applied: false,
    demo_scheduled_at: '2026-10-18T11:00:00Z',
    enrolled_at: '2026-10-26T16:30:00Z',
    notes: 'Seat confirmed for Nov 15 cohort. Tuition down payment processed, welcome onboarding packet sent.',
    created_at: '2026-10-17T13:00:00Z',
    updated_at: '2026-10-26T16:30:00Z',
    activities: [
      {
        id: 'act_05',
        inquiry_id: 'inq_05',
        counselor_id: 'cns_01',
        activity_type: 'STATUS_CHANGE',
        summary: 'Enrollment Confirmed & Seat Reserved',
        details: 'Tuition down payment verified. Student admitted into Cohort Nov-15.',
        outcome: 'Enrolled',
        created_at: '2026-10-26T16:30:00Z'
      }
    ]
  },
  {
    id: 'inq_06',
    tracking_code: 'INQ-2026-3811',
    student_name: 'Jason Miller',
    email: 'jmiller99@example.com',
    phone: '+1 (555) 321-4456',
    city: 'Atlanta, GA',
    highest_qualification: 'Associate Degree in Business',
    current_status: 'Sales Associate',
    course_id: 'crs_04',
    preferred_batch: 'Weekend Intensive',
    lead_source: 'Instagram Sponsored Post',
    stage: 'DROPPED',
    lead_score: 35,
    assigned_counselor_id: 'cns_04',
    tuition_budget: 'Undecided / Needs Loan',
    scholarship_applied: false,
    dropped_reason: 'Relocating to another city; deferred academic training to Q3 2027.',
    notes: 'Followed up twice; candidate requested file closure for current calendar year.',
    created_at: '2026-10-19T16:20:00Z',
    updated_at: '2026-10-21T11:00:00Z'
  },
  {
    id: 'inq_07',
    tracking_code: 'INQ-2026-9104',
    student_name: 'Zoya Khan',
    email: 'zoya.k@example.com',
    phone: '+1 (555) 554-1182',
    city: 'New York, NY',
    highest_qualification: 'B.S. in Statistics',
    current_status: 'Data Analyst',
    course_id: 'crs_02',
    preferred_batch: 'Weekday Evening',
    lead_source: 'Google Search (Admissions)',
    stage: 'COUNSELING_SCHEDULED',
    lead_score: 85,
    assigned_counselor_id: 'cns_02',
    tuition_budget: 'Self-Funded / Immediate',
    scholarship_applied: false,
    demo_scheduled_at: '2026-11-03T14:00:00Z',
    notes: 'Wants to level up into ML engineering & PyTorch deployment. Counseling session confirmed for Nov 3rd.',
    created_at: '2026-10-27T15:40:00Z',
    updated_at: '2026-10-27T15:40:00Z'
  },
  {
    id: 'inq_08',
    tracking_code: 'INQ-2026-2917',
    student_name: 'Lucas Garcia',
    email: 'lgarcia@example.com',
    phone: '+1 (555) 887-3421',
    city: 'San Jose, CA',
    highest_qualification: 'B.A. in Digital Arts',
    current_status: 'Graphic Designer',
    course_id: 'crs_05',
    preferred_batch: 'Weekend Intensive',
    lead_source: 'Dribbble Partnership',
    stage: 'CONTACTED',
    lead_score: 72,
    assigned_counselor_id: 'cns_03',
    tuition_budget: 'Tuition Installment Plan',
    scholarship_applied: true,
    notes: 'Sent curriculum breakdown. Asked about scholarship evaluation criteria and design mentor pairing.',
    created_at: '2026-10-25T17:10:00Z',
    updated_at: '2026-10-26T09:00:00Z'
  }
];

const STORAGE_KEYS = {
  COURSES: 'edtech_crm_courses_v1',
  COUNSELORS: 'edtech_crm_counselors_v1',
  INQUIRIES: 'edtech_crm_inquiries_v1'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// Attach nested courses and counselors to inquiries
function hydrateInquiries(inquiries: Inquiry[], courses: Course[], counselors: Counselor[]): Inquiry[] {
  const courseMap = new Map(courses.map(c => [c.id, c]));
  const counselorMap = new Map(counselors.map(c => [c.id, c]));

  return inquiries.map(inq => ({
    ...inq,
    course: inq.course_id ? courseMap.get(inq.course_id) : undefined,
    counselor: inq.assigned_counselor_id ? counselorMap.get(inq.assigned_counselor_id) : undefined,
    activities: inq.activities || [],
    tasks: inq.tasks || []
  }));
}

export const api = {
  // Course operations
  async getCourses(): Promise<Course[]> {
    return getStored<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id);
  },

  // Counselor operations
  async getCounselors(): Promise<Counselor[]> {
    return getStored<Counselor[]>(STORAGE_KEYS.COUNSELORS, INITIAL_COUNSELORS);
  },

  // Inquiries operations
  async getInquiries(filters?: {
    stage?: string;
    course_id?: string;
    counselor_id?: string;
    search?: string;
  }): Promise<Inquiry[]> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const courses = await this.getCourses();
    const counselors = await this.getCounselors();
    let list = hydrateInquiries(rawInquiries, courses, counselors);

    if (filters?.stage && filters.stage !== 'ALL') {
      list = list.filter(i => i.stage === filters.stage);
    }
    if (filters?.course_id && filters.course_id !== 'ALL') {
      list = list.filter(i => i.course_id === filters.course_id);
    }
    if (filters?.counselor_id && filters.counselor_id !== 'ALL') {
      list = list.filter(i => i.assigned_counselor_id === filters.counselor_id);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(i => 
        i.student_name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.tracking_code.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getInquiryById(id: string): Promise<Inquiry | undefined> {
    const inquiries = await this.getInquiries();
    return inquiries.find(i => i.id === id);
  },

  async trackInquiry(code: string): Promise<Inquiry | undefined> {
    const inquiries = await this.getInquiries();
    return inquiries.find(i => i.tracking_code.toUpperCase() === code.trim().toUpperCase());
  },

  async createInquiry(payload: {
    student_name: string;
    email: string;
    phone: string;
    city: string;
    highest_qualification: string;
    current_status: string;
    course_id: string;
    preferred_batch: string;
    lead_source?: string;
    tuition_budget?: string;
    scholarship_applied: boolean;
    notes?: string;
  }): Promise<Inquiry> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const counselors = await this.getCounselors();
    const courses = await this.getCourses();
    const course = courses.find(c => c.id === payload.course_id);

    // Dynamic Lead Scoring calculation (0-100)
    let score = 45;
    const qual = payload.highest_qualification.toLowerCase();
    if (qual.includes('computer') || qual.includes('engineering') || qual.includes('b.s.') || qual.includes('b.tech')) {
      score += 25;
    } else if (qual.includes('degree') || qual.includes('bca') || qual.includes('b.a.')) {
      score += 15;
    } else {
      score += 10;
    }

    if ((payload.tuition_budget || '').includes('Self-Funded') || (payload.tuition_budget || '').includes('Company')) {
      score += 20;
    } else {
      score += 10;
    }

    if (payload.notes && payload.notes.length > 25) {
      score += 10;
    }
    score = Math.min(Math.max(score, 25), 99);

    // Auto-assign counselor with lightest active workload
    const assignedCounselor = [...counselors].sort((a, b) => a.active_leads_count - b.active_leads_count)[0];
    const trackingCode = `INQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const inquiryId = `inq_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newInquiry: Inquiry = {
      id: inquiryId,
      tracking_code: trackingCode,
      student_name: payload.student_name,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      highest_qualification: payload.highest_qualification,
      current_status: payload.current_status,
      course_id: payload.course_id,
      preferred_batch: payload.preferred_batch,
      lead_source: payload.lead_source || 'Website Inquiry Form',
      stage: 'NEW',
      lead_score: score,
      assigned_counselor_id: assignedCounselor ? assignedCounselor.id : undefined,
      tuition_budget: payload.tuition_budget || 'Self-Funded / Immediate',
      scholarship_applied: payload.scholarship_applied,
      notes: payload.notes,
      created_at: now,
      updated_at: now,
      activities: [
        {
          id: `act_${Date.now()}`,
          inquiry_id: inquiryId,
          counselor_id: assignedCounselor?.id,
          activity_type: 'STATUS_CHANGE',
          summary: 'Inquiry Submitted via Public Portal',
          details: `Inquired for ${course?.title || 'Bootcamp'}. Preferred schedule: ${payload.preferred_batch}.`,
          outcome: 'Lead Captured',
          created_at: now
        }
      ],
      tasks: [
        {
          id: `tsk_${Date.now()}`,
          inquiry_id: inquiryId,
          counselor_id: assignedCounselor?.id || 'cns_01',
          title: `Initial discovery call with ${payload.student_name}`,
          due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          priority: 'HIGH',
          is_completed: false,
          created_at: now
        }
      ]
    };

    rawInquiries.unshift(newInquiry);
    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);

    // Update counselor workload
    if (assignedCounselor) {
      assignedCounselor.active_leads_count += 1;
      const updatedCounselors = counselors.map(c => c.id === assignedCounselor.id ? assignedCounselor : c);
      setStored(STORAGE_KEYS.COUNSELORS, updatedCounselors);
    }

    return newInquiry;
  },

  async updateInquiryStage(
    inquiryId: string, 
    newStage: FunnelStage, 
    options?: { dropped_reason?: string; demo_scheduled_at?: string }
  ): Promise<Inquiry> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const index = rawInquiries.findIndex(i => i.id === inquiryId);
    if (index === -1) throw new Error('Inquiry not found');

    const inq = rawInquiries[index];
    const oldStage = inq.stage;
    const now = new Date().toISOString();

    inq.stage = newStage;
    inq.updated_at = now;

    if (newStage === 'ENROLLED' && !inq.enrolled_at) {
      inq.enrolled_at = now;
      inq.lead_score = 100;
      // Increment course enrolled seats
      const courses = await this.getCourses();
      const course = courses.find(c => c.id === inq.course_id);
      if (course) {
        course.enrolled_seats += 1;
        setStored(STORAGE_KEYS.COURSES, courses);
      }
    } else if (newStage === 'DROPPED') {
      inq.dropped_reason = options?.dropped_reason || 'Student deferred enrollment';
    }

    if (options?.demo_scheduled_at) {
      inq.demo_scheduled_at = options.demo_scheduled_at;
    }

    const activity: InquiryActivity = {
      id: `act_${Date.now()}`,
      inquiry_id: inq.id,
      counselor_id: inq.assigned_counselor_id,
      activity_type: 'STATUS_CHANGE',
      summary: `Admissions Stage Changed: ${oldStage} ➔ ${newStage}`,
      details: options?.dropped_reason || `Inquiry transitioned to ${newStage} in pipeline.`,
      outcome: newStage,
      created_at: now
    };

    inq.activities = inq.activities || [];
    inq.activities.unshift(activity);

    rawInquiries[index] = inq;
    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);
    return inq;
  },

  async reassignCounselor(inquiryId: string, counselorId: string): Promise<Inquiry> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const counselors = await this.getCounselors();
    const index = rawInquiries.findIndex(i => i.id === inquiryId);
    if (index === -1) throw new Error('Inquiry not found');

    const inq = rawInquiries[index];
    const newCounselor = counselors.find(c => c.id === counselorId);
    if (!newCounselor) throw new Error('Counselor not found');

    const oldCounselor = counselors.find(c => c.id === inq.assigned_counselor_id);
    const now = new Date().toISOString();

    inq.assigned_counselor_id = newCounselor.id;
    inq.updated_at = now;

    const activity: InquiryActivity = {
      id: `act_${Date.now()}`,
      inquiry_id: inq.id,
      counselor_id: newCounselor.id,
      activity_type: 'NOTE',
      summary: `Reassigned from ${oldCounselor?.name || 'Unassigned'} to ${newCounselor.name}`,
      details: 'Workload balancing reassignment.',
      outcome: 'Reassigned',
      created_at: now
    };

    inq.activities = inq.activities || [];
    inq.activities.unshift(activity);

    rawInquiries[index] = inq;
    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);
    return inq;
  },

  async addActivity(
    inquiryId: string,
    data: {
      activity_type: ActivityType;
      summary: string;
      details?: string;
      outcome?: string;
      counselor_id?: string;
    }
  ): Promise<InquiryActivity> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const inq = rawInquiries.find(i => i.id === inquiryId);
    if (!inq) throw new Error('Inquiry not found');

    const now = new Date().toISOString();
    const act: InquiryActivity = {
      id: `act_${Date.now()}`,
      inquiry_id: inquiryId,
      counselor_id: data.counselor_id || inq.assigned_counselor_id,
      activity_type: data.activity_type,
      summary: data.summary,
      details: data.details,
      outcome: data.outcome,
      created_at: now
    };

    inq.activities = inq.activities || [];
    inq.activities.unshift(act);

    // Boost score slightly for positive counselor contact
    if (inq.lead_score < 96) {
      inq.lead_score += 2;
    }
    inq.updated_at = now;

    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);
    return act;
  },

  async addFollowUpTask(
    inquiryId: string,
    task: {
      title: string;
      due_date: string;
      priority: TaskPriority;
      counselor_id?: string;
    }
  ): Promise<FollowUpTask> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const inq = rawInquiries.find(i => i.id === inquiryId);
    if (!inq) throw new Error('Inquiry not found');

    const newTask: FollowUpTask = {
      id: `tsk_${Date.now()}`,
      inquiry_id: inquiryId,
      counselor_id: task.counselor_id || inq.assigned_counselor_id || 'cns_01',
      title: task.title,
      due_date: task.due_date,
      priority: task.priority,
      is_completed: false,
      created_at: new Date().toISOString()
    };

    inq.tasks = inq.tasks || [];
    inq.tasks.unshift(newTask);
    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);
    return newTask;
  },

  async toggleTaskCompleted(inquiryId: string, taskId: string): Promise<boolean> {
    const rawInquiries = getStored<Inquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const inq = rawInquiries.find(i => i.id === inquiryId);
    if (!inq || !inq.tasks) return false;

    const task = inq.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.is_completed = !task.is_completed;
    task.completed_at = task.is_completed ? new Date().toISOString() : undefined;
    setStored(STORAGE_KEYS.INQUIRIES, rawInquiries);
    return task.is_completed;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const inquiries = await this.getInquiries();
    const courses = await this.getCourses();
    const counselors = await this.getCounselors();

    const total = inquiries.length;
    const enrolled = inquiries.filter(i => i.stage === 'ENROLLED').length;
    const active = inquiries.filter(i => i.stage !== 'ENROLLED' && i.stage !== 'DROPPED').length;
    const conversionPct = total > 0 ? Number(((enrolled / total) * 100).toFixed(1)) : 0;

    const stages: FunnelStage[] = [
      'NEW',
      'CONTACTED',
      'COUNSELING_SCHEDULED',
      'APPLICATION_SUBMITTED',
      'ENROLLED',
      'DROPPED'
    ];

    const funnelStages = stages.map(st => {
      const count = inquiries.filter(i => i.stage === st).length;
      const rate = total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;
      return { stage: st, count, conversion_rate_pct: rate };
    });

    const sourceMap: { [key: string]: number } = {};
    inquiries.forEach(i => {
      const s = i.lead_source || 'Website';
      sourceMap[s] = (sourceMap[s] || 0) + 1;
    });

    const sources = Object.entries(sourceMap)
      .map(([source, count]) => ({
        source,
        count,
        percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.count - a.count);

    const responseTimes = [1.8, 2.3, 1.5, 2.9];
    const counselorPerf = counselors.map((c, idx) => {
      const assigned = inquiries.filter(i => i.assigned_counselor_id === c.id).length;
      const cEnrolled = inquiries.filter(i => i.assigned_counselor_id === c.id && i.stage === 'ENROLLED').length;
      return {
        counselor_id: c.id,
        name: c.name,
        assigned_leads: assigned,
        enrolled_leads: cEnrolled,
        conversion_rate_pct: assigned > 0 ? Number(((cEnrolled / assigned) * 100).toFixed(1)) : 0,
        avg_response_hours: responseTimes[idx % responseTimes.length]
      };
    });

    const courseFeeMap = new Map(courses.map(c => [c.id, c.tuition_fee]));
    const totalPipelineValue = inquiries
      .filter(i => i.stage !== 'DROPPED')
      .reduce((sum, i) => sum + (courseFeeMap.get(i.course_id) || 4000), 0);

    const confirmedRevenue = inquiries
      .filter(i => i.stage === 'ENROLLED')
      .reduce((sum, i) => sum + (courseFeeMap.get(i.course_id) || 4000), 0);

    return {
      total_inquiries: total,
      active_inquiries: active,
      total_enrolled: enrolled,
      conversion_rate_pct: conversionPct,
      funnel_stages: funnelStages,
      sources,
      counselor_performance: counselorPerf,
      total_pipeline_value: totalPipelineValue,
      confirmed_revenue: confirmedRevenue
    };
  },

  exportInquiriesCSV(inquiries: Inquiry[]): string {
    const headers = [
      'Tracking Code',
      'Student Name',
      'Email',
      'Phone',
      'City',
      'Qualification',
      'Course',
      'Stage',
      'Lead Score',
      'Assigned Counselor',
      'Tuition Budget',
      'Created Date'
    ];

    const rows = inquiries.map(i => [
      `"${i.tracking_code}"`,
      `"${i.student_name}"`,
      `"${i.email}"`,
      `"${i.phone}"`,
      `"${i.city}"`,
      `"${i.highest_qualification}"`,
      `"${i.course?.title || i.course_id}"`,
      `"${i.stage}"`,
      i.lead_score,
      `"${i.counselor?.name || 'Unassigned'}"`,
      `"${i.tuition_budget}"`,
      `"${i.created_at.split('T')[0]}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.COUNSELORS);
    window.location.reload();
  }
};
