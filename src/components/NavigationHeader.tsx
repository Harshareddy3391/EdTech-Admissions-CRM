import React from 'react';
import { 
  GraduationCap, 
  Kanban, 
  Table, 
  BarChart3, 
  BookOpen, 
  FileCode2, 
  Plus, 
  Search
} from 'lucide-react';

export type ActiveTab = 
  | 'inquiry-form' 
  | 'pipeline' 
  | 'table' 
  | 'courses' 
  | 'analytics' 
  | 'deliverables';

interface NavigationHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewInquiry: () => void;
  onOpenTracker: () => void;
  totalLeads: number;
  activeFollowUps: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenNewInquiry,
  onOpenTracker,
  totalLeads,
  activeFollowUps
}) => {
  return (
    <header className="crm-navbar sticky-top">
      <div className="container-fluid px-4 py-2 d-flex align-items-center justify-content-between gap-4">
        {/* Zone 1: Single wordmark brand identity */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="crm-brand-title fs-5 text-nowrap">EdTech Admissions CRM</span>
            <div className="text-secondary small d-none d-xl-block" style={{ fontSize: '0.75rem' }}>
              Student Inquiries & Pipeline Management
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links / View Switchers */}
        <nav className="d-flex align-items-center gap-1 overflow-x-auto py-1 flex-nowrap">
          <button
            onClick={() => onTabChange('pipeline')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'pipeline' ? 'active' : ''}`}
          >
            <Kanban size={16} />
            <span>Admissions Pipeline</span>
          </button>

          <button
            onClick={() => onTabChange('table')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'table' ? 'active' : ''}`}
          >
            <Table size={16} />
            <span>Leads Table</span>
          </button>

          <button
            onClick={() => onTabChange('inquiry-form')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'inquiry-form' ? 'active' : ''}`}
          >
            <Plus size={16} />
            <span>Public Inquiry Form</span>
          </button>

          <button
            onClick={() => onTabChange('courses')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'courses' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Courses & Cohorts</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>Funnel Analytics</span>
          </button>

          <button
            onClick={() => onTabChange('deliverables')}
            className={`nav-link-btn d-flex align-items-center gap-2 ${activeTab === 'deliverables' ? 'active' : ''}`}
          >
            <FileCode2 size={16} />
            <span>Deliverables Package</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Track */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenTracker}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 text-nowrap"
            title="Check inquiry status using reference code"
          >
            <Search size={14} />
            <span className="d-none d-sm-inline">Track Inquiry</span>
          </button>

          <button
            onClick={onOpenNewInquiry}
            className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 text-nowrap fw-semibold px-3 shadow-sm"
          >
            <Plus size={16} />
            <span>+ New Inquiry</span>
          </button>
        </div>
      </div>
    </header>
  );
};
