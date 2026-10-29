import React, { useState } from 'react';
import { 
  ChevronRight, 
  User, 
  Calendar, 
  DollarSign, 
  Clock, 
  Flame, 
  PhoneCall, 
  Plus, 
  Filter, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Inquiry, FunnelStage, Course, Counselor } from '../types';

interface KanbanPipelineProps {
  inquiries: Inquiry[];
  courses: Course[];
  counselors: Counselor[];
  onSelectInquiry: (inquiry: Inquiry) => void;
  onUpdateStage: (inquiryId: string, newStage: FunnelStage) => Promise<void>;
  onOpenNewInquiry: () => void;
}

const STAGES: { id: FunnelStage; title: string; color: string; desc: string }[] = [
  { id: 'NEW', title: 'New Inquiry', color: '#2563eb', desc: 'Fresh website & referral leads' },
  { id: 'CONTACTED', title: 'Contacted', color: '#d97706', desc: 'Initial discovery call held' },
  { id: 'COUNSELING_SCHEDULED', title: 'Demo Scheduled', color: '#7c3aed', desc: '1-on-1 counseling booked' },
  { id: 'APPLICATION_SUBMITTED', title: 'Application Submitted', color: '#0891b2', desc: 'Transcripts & review' },
  { id: 'ENROLLED', title: 'Enrolled', color: '#16a34a', desc: 'Seat confirmed & fee paid' },
  { id: 'DROPPED', title: 'Dropped', color: '#64748b', desc: 'Deferred or closed' }
];

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  inquiries,
  courses,
  counselors,
  onSelectInquiry,
  onUpdateStage,
  onOpenNewInquiry
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedCounselorFilter, setSelectedCounselorFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredInquiries = inquiries.filter(inq => {
    if (selectedCourseFilter !== 'ALL' && inq.course_id !== selectedCourseFilter) return false;
    if (selectedCounselorFilter !== 'ALL' && inq.assigned_counselor_id !== selectedCounselorFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = inq.student_name.toLowerCase().includes(q) ||
                    inq.email.toLowerCase().includes(q) ||
                    inq.tracking_code.toLowerCase().includes(q) ||
                    inq.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getNextStage = (current: FunnelStage): FunnelStage | null => {
    switch (current) {
      case 'NEW': return 'CONTACTED';
      case 'CONTACTED': return 'COUNSELING_SCHEDULED';
      case 'COUNSELING_SCHEDULED': return 'APPLICATION_SUBMITTED';
      case 'APPLICATION_SUBMITTED': return 'ENROLLED';
      default: return null;
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Top Filter Bar */}
      <div className="crm-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search box */}
          <div className="col-lg-4 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-secondary">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Search leads by name, code, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control border-start-0"
              />
            </div>
          </div>

          {/* Filter by Course */}
          <div className="col-lg-3 col-md-3">
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Programs ({courses.length})</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          </div>

          {/* Filter by Counselor */}
          <div className="col-lg-3 col-md-3">
            <select
              value={selectedCounselorFilter}
              onChange={e => setSelectedCounselorFilter(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Counselors ({counselors.length})</option>
              {counselors.map(cns => (
                <option key={cns.id} value={cns.id}>{cns.name} ({cns.role.split(' ')[0]})</option>
              ))}
            </select>
          </div>

          {/* Action CTA */}
          <div className="col-lg-2 col-md-12 text-end">
            <button
              onClick={onOpenNewInquiry}
              className="btn btn-primary btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6-Column Kanban Board Grid */}
      <div className="row g-3 flex-nowrap overflow-x-auto pb-4" style={{ minHeight: '680px' }}>
        {STAGES.map(col => {
          const columnInquiries = filteredInquiries.filter(i => i.stage === col.id);
          const totalInquiries = filteredInquiries.length;
          const percentage = totalInquiries > 0 ? Math.round((columnInquiries.length / totalInquiries) * 100) : 0;

          return (
            <div key={col.id} className="col-12 col-md-6 col-lg-4 col-xl-2" style={{ minWidth: '280px' }}>
              <div className="kanban-column h-100">
                {/* Column Header */}
                <div className="kanban-header">
                  <div>
                    <h6 className="fw-bold mb-0 text-slate-800 d-flex align-items-center gap-1.5 font-tabular">
                      <span
                        className="d-inline-block rounded-circle"
                        style={{ width: '8px', height: '8px', backgroundColor: col.color }}
                      />
                      <span>{col.title}</span>
                    </h6>
                    <span className="text-secondary small font-tabular" style={{ fontSize: '0.7rem' }}>
                      {columnInquiries.length} leads ({percentage}%)
                    </span>
                  </div>
                  <span className="kanban-count-pill font-tabular">{columnInquiries.length}</span>
                </div>

                {/* Cards Container */}
                <div className="p-2 flex-grow-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                  {columnInquiries.length === 0 ? (
                    <div className="text-center py-5 text-secondary small">
                      <p className="mb-0">No leads in this stage</p>
                    </div>
                  ) : (
                    columnInquiries.map(inq => {
                      const nextStage = getNextStage(inq.stage);
                      const isHigh = inq.lead_score >= 80;
                      const isMedium = inq.lead_score >= 60 && inq.lead_score < 80;

                      return (
                        <div
                          key={inq.id}
                          className="lead-card"
                          onClick={() => onSelectInquiry(inq)}
                        >
                          {/* Card Top: Code & Score */}
                          <div className="d-flex justify-content-between align-items-center mb-1.5">
                            <span className="text-secondary font-mono-code font-tabular small" style={{ fontSize: '0.725rem' }}>
                              {inq.tracking_code}
                            </span>
                            <span
                              className={`badge font-tabular small py-1 px-1.5 ${
                                isHigh
                                  ? 'score-badge-high'
                                  : isMedium
                                  ? 'score-badge-medium'
                                  : 'score-badge-low'
                              }`}
                              title="Admissions Lead Score (0-100)"
                            >
                              <Flame size={12} className="me-0.5 d-inline" />
                              {inq.lead_score}/100
                            </span>
                          </div>

                          {/* Student Name & City */}
                          <h6 className="fw-bold text-slate-900 mb-0.5">{inq.student_name}</h6>
                          <div className="text-secondary small mb-2 text-truncate" style={{ fontSize: '0.775rem' }}>
                            {inq.city} · {inq.highest_qualification}
                          </div>

                          {/* Program Title */}
                          <div className="bg-light p-1.5 rounded mb-2 font-tabular small text-truncate" style={{ fontSize: '0.75rem' }}>
                            <strong className="text-primary">{inq.course?.code || 'CRS'}:</strong> {inq.course?.title}
                          </div>

                          {/* Counselor & Quick Next Action */}
                          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
                            <div className="d-flex align-items-center gap-1.5 text-secondary small" style={{ fontSize: '0.75rem' }}>
                              <div
                                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '0.65rem',
                                  backgroundColor: inq.counselor?.avatar_color || '#1e3a8a'
                                }}
                              >
                                {(inq.counselor?.name || 'C')[0]}
                              </div>
                              <span className="text-truncate" style={{ maxWidth: '90px' }}>
                                {inq.counselor?.name.split(' ')[0] || 'Unassigned'}
                              </span>
                            </div>

                            {/* Quick advance button */}
                            {nextStage && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onUpdateStage(inq.id, nextStage);
                                }}
                                className="btn btn-outline-primary btn-sm py-0 px-1.5 font-tabular"
                                style={{ fontSize: '0.725rem' }}
                                title={`Advance to ${nextStage}`}
                              >
                                <span>Advance</span>
                                <ChevronRight size={12} className="ms-0.5" />
                              </button>
                            )}

                            {inq.stage === 'ENROLLED' && (
                              <span className="text-success small fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.725rem' }}>
                                <CheckCircle2 size={13} />
                                <span>Admitted</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
