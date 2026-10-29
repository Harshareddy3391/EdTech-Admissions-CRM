import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Clock, 
  BarChart, 
  PieChart,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { AnalyticsSummary, Course } from '../types';
import { api } from '../services/api';

interface AnalyticsDashboardProps {
  courses: Course[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ courses }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="container-fluid px-4 py-5 text-center text-secondary">
        <div className="spinner-border text-primary mb-2" role="status" />
        <p>Loading Admissions Analytics & Conversion Funnel...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        {/* Total Inquiries */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3">
            <span className="text-secondary small d-block mb-1">Total Leads Captured</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-dark font-tabular">{analytics.total_inquiries}</span>
              <span className="text-primary small font-tabular fw-semibold d-flex align-items-center">
                <ArrowUpRight size={13} /> +12%
              </span>
            </div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Admissions Q4</span>
          </div>
        </div>

        {/* Active Inquiries in Funnel */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3">
            <span className="text-secondary small d-block mb-1">Active in Funnel</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-primary font-tabular">{analytics.active_inquiries}</span>
              <span className="text-muted small font-tabular">Leads</span>
            </div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Under counseling</span>
          </div>
        </div>

        {/* Total Enrolled */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3 border-success-subtle">
            <span className="text-secondary small d-block mb-1">Total Enrolled</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-success font-tabular">{analytics.total_enrolled}</span>
              <span className="badge bg-success-subtle text-success font-tabular small">Confirmed</span>
            </div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Paid seats</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3">
            <span className="text-secondary small d-block mb-1">Funnel Conversion</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-indigo-700 font-tabular">{analytics.conversion_rate_pct}%</span>
              <span className="text-success small font-tabular fw-semibold d-flex align-items-center">
                <TrendingUp size={13} />
              </span>
            </div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Lead to Enrolled</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3">
            <span className="text-secondary small d-block mb-1">Pipeline Tuition</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-slate-800 font-tabular">
                ${(analytics.total_pipeline_value / 1000).toFixed(0)}k
              </span>
            </div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Estimated tuition</span>
          </div>
        </div>

        {/* Confirmed Revenue */}
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="crm-card p-3 bg-primary-subtle bg-opacity-10 border-primary-subtle">
            <span className="text-primary small d-block mb-1 fw-semibold">Confirmed Revenue</span>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-3 fw-bold text-primary font-tabular">
                ${(analytics.confirmed_revenue / 1000).toFixed(1)}k
              </span>
            </div>
            <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>Enrolled cohorts</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="row g-4 mb-4">
        {/* Funnel Drop-off Chart */}
        <div className="col-lg-7">
          <div className="crm-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold text-slate-900 mb-0">Admissions Funnel Progression & Drop-Off</h6>
                <span className="text-secondary small">Volume and retention across the 6 admissions stages</span>
              </div>
              <span className="badge bg-light text-secondary border font-tabular small">
                {analytics.total_inquiries} Candidates
              </span>
            </div>

            <div className="d-flex flex-column gap-3 pt-2">
              {analytics.funnel_stages.map(st => {
                const isEnrolled = st.stage === 'ENROLLED';
                const isDropped = st.stage === 'DROPPED';

                return (
                  <div key={st.stage} className="d-flex flex-column gap-1">
                    <div className="d-flex justify-content-between align-items-center font-tabular small">
                      <span className="fw-semibold text-dark">
                        {st.stage.replace('_', ' ')}
                      </span>
                      <div className="d-flex gap-3 text-secondary">
                        <span className="fw-bold text-dark">{st.count} leads</span>
                        <span className="text-muted">({st.conversion_rate_pct}%)</span>
                      </div>
                    </div>

                    <div className="progress" style={{ height: '12px' }}>
                      <div
                        className={`progress-bar ${
                          isEnrolled 
                            ? 'bg-success' 
                            : isDropped 
                            ? 'bg-secondary' 
                            : 'bg-primary'
                        }`}
                        role="progressbar"
                        style={{ width: `${Math.max(st.conversion_rate_pct, 4)}%` }}
                        aria-valuenow={st.count}
                        aria-valuemin={0}
                        aria-valuemax={analytics.total_inquiries}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="col-lg-5">
          <div className="crm-card p-4 h-100">
            <h6 className="fw-bold text-slate-900 mb-1">Marketing Lead Acquisition Channels</h6>
            <span className="text-secondary small d-block mb-3">Inbound lead distribution by origin</span>

            <div className="d-flex flex-column gap-2.5">
              {analytics.sources.map(src => (
                <div key={src.source} className="p-2.5 rounded bg-light border d-flex justify-content-between align-items-center font-tabular">
                  <div>
                    <span className="fw-semibold text-dark small d-block">{src.source}</span>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>Inbound Campaign</span>
                  </div>
                  <div className="text-end">
                    <strong className="text-dark small d-block">{src.count} leads</strong>
                    <span className="badge bg-white text-primary border small" style={{ fontSize: '0.7rem' }}>
                      {src.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Counselor Performance Leaderboard */}
      <div className="row g-4">
        <div className="col-12">
          <div className="crm-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold text-slate-900 mb-0">Counselor Productivity & Conversion SLA</h6>
                <span className="text-secondary small">Individual workload, enrollment success, and response times</span>
              </div>
              <span className="text-secondary small font-tabular">
                4 Active Counselors
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 font-tabular small">
                <thead className="table-light text-secondary">
                  <tr>
                    <th>Counselor Name</th>
                    <th>Assigned Leads</th>
                    <th>Confirmed Enrollments</th>
                    <th>Conversion Rate</th>
                    <th>Avg First Response</th>
                    <th>Performance Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.counselor_performance.map(cns => (
                    <tr key={cns.counselor_id}>
                      <td className="fw-bold text-dark">{cns.name}</td>
                      <td>{cns.assigned_leads} active leads</td>
                      <td className="fw-bold text-success">{cns.enrolled_leads} enrolled</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle font-tabular">
                          {cns.conversion_rate_pct}%
                        </span>
                      </td>
                      <td className="text-secondary">
                        <Clock size={13} className="me-1 d-inline text-muted" />
                        {cns.avg_response_hours} hours
                      </td>
                      <td>
                        {cns.conversion_rate_pct >= 20 ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            ★ High Performer
                          </span>
                        ) : (
                          <span className="badge bg-light text-secondary border">
                            On Target
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
