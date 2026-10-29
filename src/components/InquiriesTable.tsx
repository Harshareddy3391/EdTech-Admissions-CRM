import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Flame, 
  User, 
  FileSpreadsheet,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Inquiry, Course, Counselor, FunnelStage } from '../types';
import { api } from '../services/api';

interface InquiriesTableProps {
  inquiries: Inquiry[];
  courses: Course[];
  counselors: Counselor[];
  onSelectInquiry: (inquiry: Inquiry) => void;
  onUpdateStage: (inquiryId: string, newStage: FunnelStage) => Promise<void>;
  onOpenNewInquiry: () => void;
}

export const InquiriesTable: React.FC<InquiriesTableProps> = ({
  inquiries,
  courses,
  counselors,
  onSelectInquiry,
  onUpdateStage,
  onOpenNewInquiry
}) => {
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedCounselor, setSelectedCounselor] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter inquiries
  const filtered = inquiries.filter(inq => {
    if (selectedStage !== 'ALL' && inq.stage !== selectedStage) return false;
    if (selectedCourse !== 'ALL' && inq.course_id !== selectedCourse) return false;
    if (selectedCounselor !== 'ALL' && inq.assigned_counselor_id !== selectedCounselor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inq.student_name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.tracking_code.toLowerCase().includes(q) ||
        inq.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent = api.exportInquiriesCSV(filtered);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `edtech_admissions_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStageBadgeClass = (stage: FunnelStage) => {
    return `stage-badge stage-${stage}`;
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Table Header & Multi-Filters */}
      <div className="crm-card p-3 mb-3">
        <div className="row g-3 align-items-center">
          {/* Search bar */}
          <div className="col-lg-3 col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-secondary">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search by name, email, code, city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control border-start-0"
              />
            </div>
          </div>

          {/* Stage Filter */}
          <div className="col-lg-2 col-md-3">
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New Inquiry</option>
              <option value="CONTACTED">Contacted</option>
              <option value="COUNSELING_SCHEDULED">Counseling Demo</option>
              <option value="APPLICATION_SUBMITTED">Application</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="col-lg-3 col-md-3">
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          </div>

          {/* Counselor Filter */}
          <div className="col-lg-2 col-md-6">
            <select
              value={selectedCounselor}
              onChange={e => setSelectedCounselor(e.target.value)}
              className="form-select form-select-sm"
            >
              <option value="ALL">All Counselors</option>
              {counselors.map(cns => (
                <option key={cns.id} value={cns.id}>{cns.name}</option>
              ))}
            </select>
          </div>

          {/* Export & Actions */}
          <div className="col-lg-2 col-md-6 d-flex gap-2 justify-content-end">
            <button
              onClick={handleExportCSV}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 text-nowrap"
              title="Download CSV report of current filtered view"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenNewInquiry}
              className="btn btn-primary btn-sm text-nowrap fw-semibold px-2.5"
            >
              + Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Bootstrap Table */}
      <div className="crm-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0 font-tabular">
            <thead className="table-light small text-secondary">
              <tr>
                <th scope="col" style={{ minWidth: '180px' }}>Student Profile</th>
                <th scope="col">Tracking Code</th>
                <th scope="col" style={{ minWidth: '180px' }}>Program / Course</th>
                <th scope="col">Funnel Stage</th>
                <th scope="col">Lead Score</th>
                <th scope="col">Assigned Counselor</th>
                <th scope="col">Financing / Budget</th>
                <th scope="col">Date Logged</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-secondary">
                    No student inquiries match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(inq => {
                  const isHigh = inq.lead_score >= 80;
                  const isMedium = inq.lead_score >= 60 && inq.lead_score < 80;

                  return (
                    <tr key={inq.id}>
                      {/* Student Profile */}
                      <td>
                        <div className="fw-bold text-dark">{inq.student_name}</div>
                        <div className="text-secondary small">{inq.email}</div>
                        <div className="text-muted small" style={{ fontSize: '0.725rem' }}>
                          {inq.city} · {inq.highest_qualification}
                        </div>
                      </td>

                      {/* Tracking Code */}
                      <td>
                        <span className="badge bg-light text-dark font-mono-code border">
                          {inq.tracking_code}
                        </span>
                      </td>

                      {/* Course */}
                      <td>
                        <div className="fw-semibold text-primary small">
                          {inq.course?.code || 'CRS'}: {inq.course?.title}
                        </div>
                        <div className="text-secondary small" style={{ fontSize: '0.725rem' }}>
                          {inq.preferred_batch}
                        </div>
                      </td>

                      {/* Stage Badge */}
                      <td>
                        <span className={getStageBadgeClass(inq.stage)}>
                          {inq.stage.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Lead Score */}
                      <td>
                        <span
                          className={`badge font-tabular small py-1 px-1.5 ${
                            isHigh
                              ? 'score-badge-high'
                              : isMedium
                              ? 'score-badge-medium'
                              : 'score-badge-low'
                          }`}
                        >
                          <Flame size={12} className="me-1 d-inline" />
                          {inq.lead_score}/100
                        </span>
                      </td>

                      {/* Counselor */}
                      <td>
                        <div className="d-flex align-items-center gap-1.5">
                          <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '24px',
                              height: '24px',
                              fontSize: '0.7rem',
                              backgroundColor: inq.counselor?.avatar_color || '#1e3a8a'
                            }}
                          >
                            {(inq.counselor?.name || 'C')[0]}
                          </div>
                          <div>
                            <div className="small fw-semibold text-dark">
                              {inq.counselor?.name || 'Unassigned'}
                            </div>
                            <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                              {inq.counselor?.role.split(' ')[0] || 'Counselor'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Budget */}
                      <td>
                        <span className="small text-secondary">{inq.tuition_budget}</span>
                        {inq.scholarship_applied && (
                          <div className="text-primary small fw-semibold" style={{ fontSize: '0.7rem' }}>
                            ★ Scholarship Candidate
                          </div>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="small text-secondary">
                        {inq.created_at.split('T')[0]}
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <button
                          onClick={() => onSelectInquiry(inq)}
                          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 py-1 px-2.5 font-tabular"
                          title="Open student dossier, logs, and scoring details"
                        >
                          <span>Dossier</span>
                          <ExternalLink size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
