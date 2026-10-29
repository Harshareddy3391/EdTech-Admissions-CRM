import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  Inquiry, 
  FunnelStage, 
  Counselor, 
  ActivityType, 
  TaskPriority 
} from '../types';

interface LeadDetailModalProps {
  inquiry: Inquiry | null;
  counselors: Counselor[];
  onClose: () => void;
  onUpdateStage: (inquiryId: string, newStage: FunnelStage, options?: any) => Promise<void>;
  onReassignCounselor: (inquiryId: string, counselorId: string) => Promise<void>;
  onAddActivity: (inquiryId: string, data: any) => Promise<void>;
  onAddTask: (inquiryId: string, task: any) => Promise<void>;
  onToggleTask: (inquiryId: string, taskId: string) => Promise<void>;
}

const STAGES: FunnelStage[] = [
  'NEW',
  'CONTACTED',
  'COUNSELING_SCHEDULED',
  'APPLICATION_SUBMITTED',
  'ENROLLED',
  'DROPPED'
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  inquiry,
  counselors,
  onClose,
  onUpdateStage,
  onReassignCounselor,
  onAddActivity,
  onAddTask,
  onToggleTask
}) => {
  if (!inquiry) return null;

  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'scoring'>('timeline');
  const [activityType, setActivityType] = useState<ActivityType>('CALL');
  const [activitySummary, setActivitySummary] = useState('');
  const [activityDetails, setActivityDetails] = useState('');
  const [activityOutcome, setActivityOutcome] = useState('High Interest');
  const [isSubmittingAct, setIsSubmittingAct] = useState(false);

  // New Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('HIGH');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Reassignment state
  const [selectedCounselorId, setSelectedCounselorId] = useState(
    inquiry.assigned_counselor_id || counselors[0]?.id || ''
  );
  const [isReassigning, setIsReassigning] = useState(false);

  // Dropped reason modal
  const [showDroppedInput, setShowDroppedInput] = useState(false);
  const [droppedReason, setDroppedReason] = useState('');

  const handleStageChange = async (targetStage: FunnelStage) => {
    if (targetStage === 'DROPPED') {
      setShowDroppedInput(true);
      return;
    }
    await onUpdateStage(inquiry.id, targetStage);
  };

  const handleConfirmDropped = async () => {
    await onUpdateStage(inquiry.id, 'DROPPED', {
      dropped_reason: droppedReason || 'Candidate deferred program admission'
    });
    setShowDroppedInput(false);
  };

  const handleReassign = async () => {
    if (!selectedCounselorId || selectedCounselorId === inquiry.assigned_counselor_id) return;
    setIsReassigning(true);
    try {
      await onReassignCounselor(inquiry.id, selectedCounselorId);
    } finally {
      setIsReassigning(false);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activitySummary.trim()) return;

    setIsSubmittingAct(true);
    try {
      await onAddActivity(inquiry.id, {
        activity_type: activityType,
        summary: activitySummary,
        details: activityDetails,
        outcome: activityOutcome,
        counselor_id: inquiry.assigned_counselor_id
      });
      setActivitySummary('');
      setActivityDetails('');
    } finally {
      setIsSubmittingAct(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmittingTask(true);
    try {
      await onAddTask(inquiry.id, {
        title: taskTitle,
        due_date: taskDueDate,
        priority: taskPriority,
        counselor_id: inquiry.assigned_counselor_id
      });
      setTaskTitle('');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'CALL': return <PhoneCall size={14} className="text-primary" />;
      case 'WHATSAPP': return <MessageSquare size={14} className="text-success" />;
      case 'EMAIL': return <Mail size={14} className="text-info" />;
      case 'COUNSELING_DEMO': return <Calendar size={14} className="text-purple-600" />;
      case 'STATUS_CHANGE': return <CheckCircle2 size={14} className="text-emerald-600" />;
      default: return <MessageSquare size={14} className="text-secondary" />;
    }
  };

  return (
    <div 
      className="modal d-block modal-backdrop-blur" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          {/* Header */}
          <div className="modal-header bg-white border-bottom px-4 py-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm"
                style={{ width: '44px', height: '44px', backgroundColor: '#1e3a8a' }}
              >
                {inquiry.student_name[0]}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="modal-title fw-bold text-slate-900 mb-0">{inquiry.student_name}</h5>
                  <span className="badge bg-light text-dark font-mono-code font-tabular border">
                    {inquiry.tracking_code}
                  </span>
                  <span className={`stage-badge stage-${inquiry.stage}`}>
                    {inquiry.stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-secondary small font-tabular">
                  Inquired for: <strong>{inquiry.course?.title}</strong> · Logged on {inquiry.created_at.split('T')[0]}
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose} 
              aria-label="Close" 
            />
          </div>

          {/* Stepper Funnel Stages */}
          <div className="bg-light px-4 py-2 border-bottom">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span className="text-secondary small fw-semibold text-uppercase" style={{ fontSize: '0.7rem' }}>
                Advance Pipeline Stage:
              </span>
              <div className="btn-group btn-group-sm flex-wrap" role="group">
                {STAGES.map(st => {
                  const isCurrent = inquiry.stage === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStageChange(st)}
                      className={`btn btn-sm ${
                        isCurrent 
                          ? 'btn-primary fw-bold' 
                          : 'btn-outline-secondary'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {showDroppedInput && (
              <div className="p-3 bg-white rounded border border-danger-subtle mt-2">
                <label className="form-label small fw-semibold text-danger">Reason for Dropping / Closing Lead:</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="e.g. Relocating, insufficient funds, enrolled elsewhere..."
                    value={droppedReason}
                    onChange={e => setDroppedReason(e.target.value)}
                    className="form-control"
                  />
                  <button onClick={handleConfirmDropped} className="btn btn-danger">Confirm Drop</button>
                  <button onClick={() => setShowDroppedInput(false)} className="btn btn-light">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-slate-50">
            <div className="row g-4">
              {/* Left Column: Student Details & Counselor Assignment */}
              <div className="col-lg-4">
                {/* Profile Card */}
                <div className="crm-card p-3 mb-3">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-1.5">
                    <User size={16} className="text-primary" />
                    <span>Candidate Profile</span>
                  </h6>

                  <div className="d-flex flex-column gap-2 small">
                    <div className="d-flex align-items-center gap-2 text-secondary">
                      <Mail size={14} className="text-muted" />
                      <a href={`mailto:${inquiry.email}`} className="text-dark text-decoration-none">
                        {inquiry.email}
                      </a>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-secondary">
                      <Phone size={14} className="text-muted" />
                      <span className="text-dark font-tabular">{inquiry.phone}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-secondary">
                      <MapPin size={14} className="text-muted" />
                      <span className="text-dark">{inquiry.city}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top d-flex flex-column gap-1.5 small font-tabular">
                    <div>
                      <span className="text-secondary d-block">Education:</span>
                      <strong className="text-dark">{inquiry.highest_qualification}</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Current Status:</span>
                      <strong className="text-dark">{inquiry.current_status}</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Preferred Cohort Batch:</span>
                      <strong className="text-dark">{inquiry.preferred_batch}</strong>
                    </div>
                    <div>
                      <span className="text-secondary d-block">Tuition Budget:</span>
                      <strong className="text-dark">{inquiry.tuition_budget}</strong>
                    </div>
                    {inquiry.scholarship_applied && (
                      <div className="mt-1 p-2 bg-warning-subtle text-warning-emphasis rounded border border-warning-subtle small">
                        ★ Applied for Merit Scholarship
                      </div>
                    )}
                  </div>
                </div>

                {/* Lead Score Widget */}
                <div className="crm-card p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                      <Flame size={16} className="text-danger" />
                      <span>Admissions Score</span>
                    </h6>
                    <span className="fs-5 fw-bold text-primary font-tabular">
                      {inquiry.lead_score}/100
                    </span>
                  </div>

                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${
                        inquiry.lead_score >= 80 ? 'bg-success' : inquiry.lead_score >= 60 ? 'bg-warning' : 'bg-danger'
                      }`}
                      role="progressbar"
                      style={{ width: `${inquiry.lead_score}%` }}
                    />
                  </div>

                  <div className="small text-secondary d-flex flex-column gap-1">
                    <div className="d-flex justify-content-between font-tabular">
                      <span>Academic Background</span>
                      <strong>25/25</strong>
                    </div>
                    <div className="d-flex justify-content-between font-tabular">
                      <span>Timeline & Batch Urgency</span>
                      <strong>22/25</strong>
                    </div>
                    <div className="d-flex justify-content-between font-tabular">
                      <span>Tuition Readiness</span>
                      <strong>{inquiry.tuition_budget.includes('Self') ? '25/25' : '18/25'}</strong>
                    </div>
                    <div className="d-flex justify-content-between font-tabular">
                      <span>Counselor Touchpoints</span>
                      <strong>{Math.min((inquiry.activities?.length || 1) * 6, 25)}/25</strong>
                    </div>
                  </div>
                </div>

                {/* Counselor Reassignment */}
                <div className="crm-card p-3">
                  <h6 className="fw-bold text-dark mb-2">Assigned Counselor</h6>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: inquiry.counselor?.avatar_color || '#1e3a8a'
                      }}
                    >
                      {(inquiry.counselor?.name || 'C')[0]}
                    </div>
                    <div>
                      <div className="fw-semibold text-dark small">{inquiry.counselor?.name || 'Unassigned'}</div>
                      <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>
                        {inquiry.counselor?.email}
                      </div>
                    </div>
                  </div>

                  <label className="form-label small text-secondary">Reassign to Counselor:</label>
                  <div className="input-group input-group-sm">
                    <select
                      value={selectedCounselorId}
                      onChange={e => setSelectedCounselorId(e.target.value)}
                      className="form-select form-select-sm"
                    >
                      {counselors.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.active_leads_count} active leads)
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleReassign}
                      disabled={isReassigning || selectedCounselorId === inquiry.assigned_counselor_id}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Activity Timeline & Follow-up Tasks */}
              <div className="col-lg-8">
                {/* Tab Navigation */}
                <div className="crm-card p-0 overflow-hidden mb-3">
                  <div className="d-flex border-bottom bg-white">
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`btn btn-sm rounded-0 py-2.5 px-4 fw-semibold border-0 ${
                        activeTab === 'timeline' 
                          ? 'border-bottom border-primary border-3 text-primary bg-light' 
                          : 'text-secondary'
                      }`}
                    >
                      Activity Timeline ({inquiry.activities?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className={`btn btn-sm rounded-0 py-2.5 px-4 fw-semibold border-0 ${
                        activeTab === 'tasks' 
                          ? 'border-bottom border-primary border-3 text-primary bg-light' 
                          : 'text-secondary'
                      }`}
                    >
                      Follow-up Tasks ({inquiry.tasks?.length || 0})
                    </button>
                  </div>

                  {/* Tab 1: Activity Timeline */}
                  {activeTab === 'timeline' && (
                    <div className="p-3">
                      {/* Log Activity Form */}
                      <form onSubmit={handleCreateActivity} className="p-3 bg-light rounded-3 mb-4 border">
                        <span className="small fw-bold text-dark d-block mb-2">Log Counselor Touchpoint</span>
                        <div className="row g-2">
                          <div className="col-md-4">
                            <select
                              value={activityType}
                              onChange={e => setActivityType(e.target.value as ActivityType)}
                              className="form-select form-select-sm"
                            >
                              <option value="CALL">Phone Call</option>
                              <option value="WHATSAPP">WhatsApp Message</option>
                              <option value="EMAIL">Email Sent</option>
                              <option value="COUNSELING_DEMO">Counseling Demo</option>
                              <option value="NOTE">Counselor Note</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select
                              value={activityOutcome}
                              onChange={e => setActivityOutcome(e.target.value)}
                              className="form-select form-select-sm"
                            >
                              <option value="High Interest">High Interest</option>
                              <option value="Scheduled Counseling">Scheduled Counseling</option>
                              <option value="Follow-up Requested">Follow-up Requested</option>
                              <option value="Awaiting Documents">Awaiting Transcripts</option>
                              <option value="Unreachable / Voicemail">Unreachable / Voicemail</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              required
                              placeholder="Summary (e.g. Discussed scholarship)"
                              value={activitySummary}
                              onChange={e => setActivitySummary(e.target.value)}
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-12">
                            <textarea
                              rows={2}
                              placeholder="Detailed conversation notes..."
                              value={activityDetails}
                              onChange={e => setActivityDetails(e.target.value)}
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-12 text-end">
                            <button
                              type="submit"
                              disabled={isSubmittingAct}
                              className="btn btn-primary btn-sm px-3 fw-semibold"
                            >
                              {isSubmittingAct ? 'Saving...' : 'Add Touchpoint'}
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Timeline Events List */}
                      <div className="d-flex flex-column gap-3">
                        {inquiry.activities && inquiry.activities.length > 0 ? (
                          inquiry.activities.map(act => (
                            <div key={act.id} className="d-flex gap-3 align-items-start p-2.5 bg-white rounded border">
                              <div className="p-2 bg-light rounded-circle flex-shrink-0 mt-0.5">
                                {getActivityIcon(act.activity_type)}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                  <h6 className="fw-bold text-dark mb-0 small">{act.summary}</h6>
                                  <span className="text-secondary font-tabular" style={{ fontSize: '0.7rem' }}>
                                    {act.created_at.replace('T', ' ').substring(0, 16)}
                                  </span>
                                </div>
                                {act.details && (
                                  <p className="text-secondary small mb-1 mt-1">{act.details}</p>
                                )}
                                {act.outcome && (
                                  <span className="badge bg-secondary-subtle text-secondary small font-tabular">
                                    Outcome: {act.outcome}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-secondary small">
                            No activities logged yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Follow-up Tasks */}
                  {activeTab === 'tasks' && (
                    <div className="p-3">
                      {/* Add Task Form */}
                      <form onSubmit={handleCreateTask} className="p-3 bg-light rounded-3 mb-4 border">
                        <span className="small fw-bold text-dark d-block mb-2">Add Follow-up Reminder</span>
                        <div className="row g-2">
                          <div className="col-md-6">
                            <input
                              type="text"
                              required
                              placeholder="Task description (e.g. Send offer letter)"
                              value={taskTitle}
                              onChange={e => setTaskTitle(e.target.value)}
                              className="form-control form-control-sm"
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="date"
                              required
                              value={taskDueDate}
                              onChange={e => setTaskDueDate(e.target.value)}
                              className="form-control form-control-sm font-tabular"
                            />
                          </div>
                          <div className="col-md-3">
                            <select
                              value={taskPriority}
                              onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                              className="form-select form-select-sm"
                            >
                              <option value="URGENT">Urgent Priority</option>
                              <option value="HIGH">High Priority</option>
                              <option value="MEDIUM">Medium Priority</option>
                              <option value="LOW">Low Priority</option>
                            </select>
                          </div>
                          <div className="col-12 text-end">
                            <button
                              type="submit"
                              disabled={isSubmittingTask}
                              className="btn btn-primary btn-sm px-3 fw-semibold"
                            >
                              {isSubmittingTask ? 'Creating...' : 'Create Task'}
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Tasks List */}
                      <div className="d-flex flex-column gap-2">
                        {inquiry.tasks && inquiry.tasks.length > 0 ? (
                          inquiry.tasks.map(task => (
                            <div
                              key={task.id}
                              onClick={() => onToggleTask(inquiry.id, task.id)}
                              className={`p-2.5 rounded border d-flex align-items-center gap-3 cursor-pointer ${
                                task.is_completed ? 'bg-light opacity-75' : 'bg-white'
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              {task.is_completed ? (
                                <CheckSquare size={18} className="text-success flex-shrink-0" />
                              ) : (
                                <Square size={18} className="text-secondary flex-shrink-0" />
                              )}
                              <div className="flex-grow-1">
                                <div className={`small fw-semibold ${task.is_completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                                  {task.title}
                                </div>
                                <div className="text-secondary small font-tabular" style={{ fontSize: '0.7rem' }}>
                                  Due: {task.due_date} · Priority: <strong className={task.priority === 'URGENT' ? 'text-danger' : 'text-dark'}>{task.priority}</strong>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-secondary small">
                            No follow-up tasks recorded for this lead.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-white border-top px-4 py-2">
            <button type="button" className="btn btn-light btn-sm" onClick={onClose}>
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
