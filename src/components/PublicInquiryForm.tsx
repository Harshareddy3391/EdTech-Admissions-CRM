import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Course, Inquiry } from '../types';

interface PublicInquiryFormProps {
  courses: Course[];
  onSubmitInquiry: (data: any) => Promise<Inquiry>;
  onViewPipeline: () => void;
  onTrackCode: (code: string) => void;
}

export const PublicInquiryForm: React.FC<PublicInquiryFormProps> = ({
  courses,
  onSubmitInquiry,
  onViewPipeline,
  onTrackCode
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs_01');
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    phone: '',
    city: '',
    highest_qualification: 'B.S. in Computer Science',
    current_status: 'Final Year Student',
    preferred_batch: 'Weekend Intensive',
    lead_source: 'Website Inquiry Form',
    tuition_budget: 'Self-Funded / Immediate',
    scholarship_applied: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.student_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city/location.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await onSubmitInquiry({
        ...formData,
        course_id: selectedCourseId
      });
      setCreatedInquiry(res);
      // Reset form
      setFormData({
        student_name: '',
        email: '',
        phone: '',
        city: '',
        highest_qualification: 'B.S. in Computer Science',
        current_status: 'Final Year Student',
        preferred_batch: 'Weekend Intensive',
        lead_source: 'Website Inquiry Form',
        tuition_budget: 'Self-Funded / Immediate',
        scholarship_applied: false,
        notes: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-4 max-w-7xl">
      {/* Header Banner */}
      <div className="row mb-4">
        <div className="col-12 text-center py-3">
          <span className="text-primary fw-bold text-uppercase small tracking-wide">
            Admissions Open · Cohort Q4 2026
          </span>
          <h1 className="display-6 fw-bold text-slate-900 mt-1 mb-2">
            Accelerate Your Tech Career With Industry Mentors
          </h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: '680px' }}>
            Submit an admissions inquiry to receive personalized course counseling, curriculum brochures, scholarship evaluation, and batch schedules.
          </p>
        </div>
      </div>

      {/* Submission Success Modal / Alert */}
      {createdInquiry && (
        <div className="row mb-4">
          <div className="col-lg-10 mx-auto">
            <div className="crm-card p-4 border-success bg-white shadow-sm">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-success text-white p-2 rounded-circle flex-shrink-0">
                  <CheckCircle2 size={28} />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h4 className="fw-bold text-success mb-1">Inquiry Submitted Successfully!</h4>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 font-tabular fs-6">
                      Tracking Code: {createdInquiry.tracking_code}
                    </span>
                  </div>
                  <p className="text-secondary mt-1 mb-3">
                    Thank you, <strong>{createdInquiry.student_name}</strong>. An admissions counselor has been assigned to your profile and will contact you within 24 business hours to schedule your counseling session.
                  </p>

                  <div className="p-3 bg-light rounded-3 mb-3 d-flex flex-wrap gap-4 font-tabular small">
                    <div>
                      <span className="text-secondary d-block">Program</span>
                      <strong className="text-dark">{createdInquiry.course?.title || 'Bootcamp'}</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Initial Lead Score</span>
                      <strong className="text-primary">{createdInquiry.lead_score}/100</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Assigned Counselor</span>
                      <strong className="text-dark">{createdInquiry.counselor?.name || 'Assigned'}</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Preferred Schedule</span>
                      <strong className="text-dark">{createdInquiry.preferred_batch}</strong>
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      onClick={() => onTrackCode(createdInquiry.tracking_code)}
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5"
                    >
                      <span>Track Inquiry Status</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={onViewPipeline}
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1.5"
                    >
                      <span>View in Counselor Pipeline</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setCreatedInquiry(null)}
                      className="btn btn-light btn-sm ms-auto"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Course Discovery on Left, Form on Right */}
      <div className="row g-4">
        {/* Left Column: Programs Selector */}
        <div className="col-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 text-slate-800 d-flex align-items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              <span>Select Academic Program</span>
            </h5>
            <span className="text-secondary small">{courses.length} Bootcamps Available</span>
          </div>

          <div className="d-flex flex-column gap-3">
            {courses.map(course => {
              const isSelected = course.id === selectedCourseId;
              const seatsLeft = course.max_seats - course.enrolled_seats;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`crm-card p-3 cursor-pointer ${
                    isSelected ? 'border-primary shadow-sm bg-primary-subtle bg-opacity-10' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="badge bg-secondary-subtle text-secondary font-tabular font-mono-code small">
                      {course.code}
                    </span>
                    <span className="fw-bold text-primary font-tabular fs-6">
                      ${course.tuition_fee.toLocaleString()}
                    </span>
                  </div>

                  <h6 className="fw-bold text-slate-900 mb-1">{course.title}</h6>
                  <p className="text-secondary small mb-2">{course.department} · {course.level}</p>

                  <div className="d-flex flex-wrap gap-3 text-secondary small font-tabular pt-2 border-top border-light-subtle">
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={13} />
                      {course.duration_weeks} Weeks
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={13} />
                      Starts {course.next_cohort_date}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-success">
                      <Users size={13} />
                      {seatsLeft} Seats Left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inquiry Submission Form */}
        <div className="col-lg-7">
          <div className="crm-card p-4">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">Student Admissions Inquiry Form</h5>
                <p className="text-secondary small mb-0">
                  Applying for: <strong className="text-primary">{selectedCourse?.title}</strong>
                </p>
              </div>
              <span className="badge bg-light text-dark border font-tabular small px-2.5 py-1.5">
                Cohort Date: {selectedCourse?.next_cohort_date}
              </span>
            </div>

            {errorMessage && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-3">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={formData.student_name}
                    onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="maya.lin@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* City / Country */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">City / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boston, MA"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="form-control"
                  />
                </div>

                {/* Highest Qualification */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Highest Qualification</label>
                  <select
                    className="form-select"
                    value={formData.highest_qualification}
                    onChange={e => setFormData({ ...formData, highest_qualification: e.target.value })}
                  >
                    <option value="B.S. in Computer Science">B.S. in Computer Science</option>
                    <option value="B.Tech / B.E. (Engineering)">B.Tech / B.E. (Engineering)</option>
                    <option value="B.S. in Mathematics or Science">B.S. in Mathematics / Science</option>
                    <option value="B.A. in Arts or Humanities">B.A. in Arts or Humanities</option>
                    <option value="High School Diploma / Associate Degree">High School Diploma / Associate</option>
                    <option value="Master's Degree (M.S. / M.Tech)">Master's Degree (M.S. / M.Tech)</option>
                    <option value="Other / Self-Taught">Other / Self-Taught</option>
                  </select>
                </div>

                {/* Current Employment Status */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Current Career Status</label>
                  <select
                    className="form-select"
                    value={formData.current_status}
                    onChange={e => setFormData({ ...formData, current_status: e.target.value })}
                  >
                    <option value="Final Year Student">Final Year Student</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                    <option value="Working Professional (Career Switcher)">Working Professional (Career Switcher)</option>
                    <option value="Software / IT Engineer">Software / IT Engineer</option>
                    <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                    <option value="Between Roles">Between Roles</option>
                  </select>
                </div>

                {/* Preferred Batch Timing */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Preferred Cohort Schedule</label>
                  <select
                    className="form-select"
                    value={formData.preferred_batch}
                    onChange={e => setFormData({ ...formData, preferred_batch: e.target.value })}
                  >
                    <option value="Weekend Intensive">Weekend Intensive (Sat-Sun)</option>
                    <option value="Weekday Evening">Weekday Evening (Mon-Thu 7-10 PM)</option>
                    <option value="Full-time Bootcamp">Full-time Bootcamp (Mon-Fri 9-5 PM)</option>
                  </select>
                </div>

                {/* Tuition Financing */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Tuition & Financing Plan</label>
                  <select
                    className="form-select"
                    value={formData.tuition_budget}
                    onChange={e => setFormData({ ...formData, tuition_budget: e.target.value })}
                  >
                    <option value="Self-Funded / Immediate">Self-Funded / Immediate Payment</option>
                    <option value="Tuition Installment Plan">Tuition Installment Plan (3-6 Months)</option>
                    <option value="Company Sponsorship">Company Sponsorship</option>
                    <option value="Education Loan Assistance">Education Loan Assistance Needed</option>
                  </select>
                </div>

                {/* Lead Source */}
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">How did you hear about us?</label>
                  <select
                    className="form-select"
                    value={formData.lead_source}
                    onChange={e => setFormData({ ...formData, lead_source: e.target.value })}
                  >
                    <option value="Website Inquiry Form">Website Direct</option>
                    <option value="Google Search (Admissions)">Google Search</option>
                    <option value="LinkedIn Campaign">LinkedIn</option>
                    <option value="Alumni Referral">Alumni Referral</option>
                    <option value="Campus Recruitment Drive">Campus Drive</option>
                    <option value="YouTube / Tech Podcast">YouTube / Podcast</option>
                  </select>
                </div>

                {/* Scholarship Checkbox */}
                <div className="col-md-6 d-flex align-items-center pt-md-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="scholarship_check"
                      checked={formData.scholarship_applied}
                      onChange={e => setFormData({ ...formData, scholarship_applied: e.target.checked })}
                      className="form-check-input"
                    />
                    <label htmlFor="scholarship_check" className="form-check-label small fw-semibold text-slate-800">
                      Apply for Merit / Diversity Scholarship (up to 30% off tuition)
                    </label>
                  </div>
                </div>

                {/* Academic Goals & Questions */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">Academic Goals & Specific Questions</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your background, career target, and any questions about our curriculum or counseling..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="form-control"
                  />
                  <div className="form-text small">
                    Detailed answers help our admissions team match you with the right faculty counselor.
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="col-12 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>Processing Inquiry & Calculating Fit...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Admissions Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
