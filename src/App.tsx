import React, { useState, useEffect, useCallback } from 'react';
import { 
  NavigationHeader, 
  ActiveTab 
} from './components/NavigationHeader';
import { PublicInquiryForm } from './components/PublicInquiryForm';
import { KanbanPipeline } from './components/KanbanPipeline';
import { InquiriesTable } from './components/InquiriesTable';
import { LeadDetailModal } from './components/LeadDetailModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CoursesCatalog } from './components/CoursesCatalog';
import { DeliverablesViewer } from './components/DeliverablesViewer';
import { TrackInquiryModal } from './components/TrackInquiryModal';
import { 
  Inquiry, 
  Course, 
  Counselor, 
  FunnelStage 
} from './types';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pipeline');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected lead modal drawer
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Tracker modal
  const [showTracker, setShowTracker] = useState(false);
  const [trackerCode, setTrackerCode] = useState('');

  // Initial Data Fetching
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedCourses, fetchedCounselors, fetchedInquiries] = await Promise.all([
        api.getCourses(),
        api.getCounselors(),
        api.getInquiries()
      ]);
      setCourses(fetchedCourses);
      setCounselors(fetchedCounselors);
      setInquiries(fetchedInquiries);

      // Refresh currently selected inquiry if open
      if (selectedInquiry) {
        const refreshed = fetchedInquiries.find(i => i.id === selectedInquiry.id);
        if (refreshed) setSelectedInquiry(refreshed);
      }
    } catch (err) {
      console.error('Failed to load CRM data', err);
    } finally {
      setLoading(false);
    }
  }, [selectedInquiry]);

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleCreateInquiry = async (formData: any): Promise<Inquiry> => {
    const created = await api.createInquiry(formData);
    await loadData();
    return created;
  };

  const handleUpdateStage = async (inquiryId: string, newStage: FunnelStage, options?: any) => {
    const updated = await api.updateInquiryStage(inquiryId, newStage, options);
    await loadData();
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry(updated);
    }
  };

  const handleReassignCounselor = async (inquiryId: string, counselorId: string) => {
    const updated = await api.reassignCounselor(inquiryId, counselorId);
    await loadData();
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry(updated);
    }
  };

  const handleAddActivity = async (inquiryId: string, data: any) => {
    await api.addActivity(inquiryId, data);
    await loadData();
  };

  const handleAddTask = async (inquiryId: string, task: any) => {
    await api.addFollowUpTask(inquiryId, task);
    await loadData();
  };

  const handleToggleTask = async (inquiryId: string, taskId: string) => {
    await api.toggleTaskCompleted(inquiryId, taskId);
    await loadData();
  };

  const handleOpenTrackerWithCode = (code: string) => {
    setTrackerCode(code);
    setShowTracker(true);
  };

  const totalLeads = inquiries.length;
  const activeFollowUps = inquiries.reduce(
    (acc, inq) => acc + (inq.tasks?.filter(t => !t.is_completed).length || 0), 
    0
  );

  return (
    <div className="min-vh-100 d-flex flex-column bg-body">
      {/* 3-Zone Navigation Top Bar */}
      <NavigationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewInquiry={() => setActiveTab('inquiry-form')}
        onOpenTracker={() => setShowTracker(true)}
        totalLeads={totalLeads}
        activeFollowUps={activeFollowUps}
      />

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {loading ? (
          <div className="container py-5 text-center text-secondary">
            <div className="spinner-border text-primary mb-2" role="status" />
            <p className="font-tabular">Initializing Admissions CRM Environment...</p>
          </div>
        ) : (
          <>
            {activeTab === 'pipeline' && (
              <KanbanPipeline
                inquiries={inquiries}
                courses={courses}
                counselors={counselors}
                onSelectInquiry={setSelectedInquiry}
                onUpdateStage={handleUpdateStage}
                onOpenNewInquiry={() => setActiveTab('inquiry-form')}
              />
            )}

            {activeTab === 'table' && (
              <InquiriesTable
                inquiries={inquiries}
                courses={courses}
                counselors={counselors}
                onSelectInquiry={setSelectedInquiry}
                onUpdateStage={handleUpdateStage}
                onOpenNewInquiry={() => setActiveTab('inquiry-form')}
              />
            )}

            {activeTab === 'inquiry-form' && (
              <PublicInquiryForm
                courses={courses}
                onSubmitInquiry={handleCreateInquiry}
                onViewPipeline={() => setActiveTab('pipeline')}
                onTrackCode={handleOpenTrackerWithCode}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesCatalog
                courses={courses}
                onSelectCourseForInquiry={courseId => {
                  setActiveTab('inquiry-form');
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard courses={courses} />
            )}

            {activeTab === 'deliverables' && (
              <DeliverablesViewer />
            )}
          </>
        )}
      </main>

      {/* Student Lead Dossier Modal / Drawer */}
      {selectedInquiry && (
        <LeadDetailModal
          inquiry={selectedInquiry}
          counselors={counselors}
          onClose={() => setSelectedInquiry(null)}
          onUpdateStage={handleUpdateStage}
          onReassignCounselor={handleReassignCounselor}
          onAddActivity={handleAddActivity}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
        />
      )}

      {/* Student Inquiry Status Lookup Modal */}
      {showTracker && (
        <TrackInquiryModal
          initialCode={trackerCode}
          onClose={() => setShowTracker(false)}
          onSelectInquiry={setSelectedInquiry}
        />
      )}

      {/* Minimalist Footer */}
      <footer className="bg-white border-top py-2.5 px-4 text-secondary small font-tabular">
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            EdTech CRM & Student Admissions System · Powered by Python FastAPI & React.js
          </span>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => api.resetDemoData()}
              className="btn btn-link p-0 text-secondary text-decoration-none small"
              title="Reset sample candidate records"
            >
              Reset Seed Data
            </button>
            <span aria-hidden="true">·</span>
            <span>schema.sql ready for PostgreSQL / SQLite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
