import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Course } from '../types';

interface CoursesCatalogProps {
  courses: Course[];
  onSelectCourseForInquiry: (courseId: string) => void;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  courses,
  onSelectCourseForInquiry
}) => {
  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-slate-900 mb-1">Academic Programs & Cohorts Catalog</h4>
          <span className="text-secondary small">
            Curated bootcamps and fellowships with dedicated admissions pipelines
          </span>
        </div>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle font-tabular px-3 py-1.5 fs-6">
          {courses.length} Active Tracks
        </span>
      </div>

      {/* Grid of Courses */}
      <div className="row g-4">
        {courses.map(course => {
          const seatsLeft = course.max_seats - course.enrolled_seats;
          const fillPercentage = Math.round((course.enrolled_seats / course.max_seats) * 100);

          return (
            <div key={course.id} className="col-lg-6 col-xl-4">
              <div className="crm-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary-subtle text-secondary font-mono-code small">
                      {course.code}
                    </span>
                    <span className="fs-5 fw-bold text-primary font-tabular">
                      ${course.tuition_fee.toLocaleString()}
                    </span>
                  </div>

                  <h5 className="fw-bold text-slate-900 mb-1">{course.title}</h5>
                  <p className="text-secondary small mb-3">
                    {course.department} · {course.level}
                  </p>

                  {/* Prerequisites */}
                  {course.prerequisites && (
                    <div className="p-2.5 bg-light rounded-3 mb-3 small">
                      <span className="text-secondary fw-semibold d-block mb-0.5" style={{ fontSize: '0.75rem' }}>
                        Prerequisites & Target Background:
                      </span>
                      <span className="text-dark">{course.prerequisites}</span>
                    </div>
                  )}

                  {/* Cohort Meta */}
                  <div className="d-flex flex-column gap-2 text-secondary small font-tabular mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Clock size={15} className="text-muted" />
                      <span>Duration: <strong>{course.duration_weeks} Weeks Intensive</strong></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={15} className="text-muted" />
                      <span>Next Cohort Date: <strong>{course.next_cohort_date}</strong></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Award size={15} className="text-muted" />
                      <span>Delivery Format: <strong>{course.delivery_mode}</strong></span>
                    </div>
                  </div>

                  {/* Seat Capacity Progress */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center font-tabular small mb-1">
                      <span className="text-secondary">Cohort Seat Capacity</span>
                      <strong className={seatsLeft <= 5 ? 'text-danger' : 'text-success'}>
                        {seatsLeft} Seats Available ({fillPercentage}% Filled)
                      </strong>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className={`progress-bar ${fillPercentage >= 80 ? 'bg-warning' : 'bg-primary'}`}
                        role="progressbar"
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-3 border-top border-light-subtle">
                  <button
                    onClick={() => onSelectCourseForInquiry(course.id)}
                    className="btn btn-outline-primary btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5 py-2"
                  >
                    <span>Apply / Inquire for this Cohort</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
