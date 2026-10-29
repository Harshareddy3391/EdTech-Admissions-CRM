export type FunnelStage = 
  | 'NEW'
  | 'CONTACTED'
  | 'COUNSELING_SCHEDULED'
  | 'APPLICATION_SUBMITTED'
  | 'ENROLLED'
  | 'DROPPED';

export type ActivityType = 
  | 'CALL'
  | 'EMAIL'
  | 'WHATSAPP'
  | 'COUNSELING_DEMO'
  | 'NOTE'
  | 'STATUS_CHANGE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  level: string;
  duration_weeks: number;
  tuition_fee: number;
  max_seats: number;
  enrolled_seats: number;
  next_cohort_date: string;
  delivery_mode: string;
  prerequisites?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  target_enrollments: number;
  active_leads_count: number;
  avatar_color: string;
  is_active: boolean;
  created_at?: string;
}

export interface InquiryActivity {
  id: string;
  inquiry_id: string;
  counselor_id?: string;
  activity_type: ActivityType;
  summary: string;
  details?: string;
  outcome?: string;
  created_at: string;
}

export interface FollowUpTask {
  id: string;
  inquiry_id: string;
  counselor_id: string;
  title: string;
  due_date: string;
  priority: TaskPriority;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  tracking_code: string;
  student_name: string;
  email: string;
  phone: string;
  city: string;
  highest_qualification: string;
  current_status: string;
  course_id: string;
  preferred_batch: string;
  lead_source: string;
  stage: FunnelStage;
  lead_score: number;
  assigned_counselor_id?: string;
  tuition_budget: string;
  scholarship_applied: boolean;
  demo_scheduled_at?: string;
  enrolled_at?: string;
  dropped_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  course?: Course;
  counselor?: Counselor;
  activities?: InquiryActivity[];
  tasks?: FollowUpTask[];
}

export interface StageCount {
  stage: FunnelStage;
  count: number;
  conversion_rate_pct: number;
}

export interface LeadSourceMetric {
  source: string;
  count: number;
  percentage: number;
}

export interface CounselorPerformance {
  counselor_id: string;
  name: string;
  assigned_leads: number;
  enrolled_leads: number;
  conversion_rate_pct: number;
  avg_response_hours: number;
}

export interface AnalyticsSummary {
  total_inquiries: number;
  active_inquiries: number;
  total_enrolled: number;
  conversion_rate_pct: number;
  funnel_stages: StageCount[];
  sources: LeadSourceMetric[];
  counselor_performance: CounselorPerformance[];
  total_pipeline_value: number;
  confirmed_revenue: number;
}
