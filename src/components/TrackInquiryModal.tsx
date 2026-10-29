import React, { useState } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Calendar, 
  Clock, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Inquiry } from '../types';
import { api } from '../services/api';

interface TrackInquiryModalProps {
  initialCode?: string;
  onClose: () => void;
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export const TrackInquiryModal: React.FC<TrackInquiryModalProps> = ({
  initialCode = '',
  onClose,
  onSelectInquiry
}) => {
  const [code, setCode] = useState(initialCode);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError('');
    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await api.trackInquiry(code);
      if (res) {
        setInquiry(res);
      } else {
        setInquiry(null);
        setError('No inquiry record matches this tracking reference code.');
      }
    } catch (err: any) {
      setError(err.message || 'Lookup failed.');
      setInquiry(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div 
      className="modal d-block modal-backdrop-blur" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header border-bottom px-4 py-3 bg-white">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <Search size={18} className="text-primary" />
              <span>Track Student Admissions Inquiry</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>

          <div className="modal-body p-4 bg-light">
            <form onSubmit={handleSearch} className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Enter Inquiry Tracking Code (e.g. INQ-2026-8821):
              </label>
              <div className="input-group">
                <input
                  type="text"
                  required
                  placeholder="INQ-2026-XXXX"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="form-control font-mono-code font-tabular"
                />
                <button type="submit" disabled={isSearching} className="btn btn-primary px-3 fw-semibold">
                  {isSearching ? 'Searching...' : 'Lookup'}
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {inquiry && (
              <div className="crm-card p-3 bg-white border">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{inquiry.student_name}</h6>
                    <span className="text-secondary small font-mono-code">{inquiry.tracking_code}</span>
                  </div>
                  <span className={`stage-badge stage-${inquiry.stage}`}>
                    {inquiry.stage.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-2.5 bg-light rounded-3 my-2 small font-tabular">
                  <div>
                    <span className="text-secondary d-block">Academic Program:</span>
                    <strong className="text-primary">{inquiry.course?.title}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-secondary d-block">Preferred Cohort Timing:</span>
                    <strong className="text-dark">{inquiry.preferred_batch}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-secondary d-block">Assigned Admissions Counselor:</span>
                    <strong className="text-dark">{inquiry.counselor?.name || 'Assigned to Admissions Team'}</strong>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2">
                  <span className="text-secondary small font-tabular" style={{ fontSize: '0.75rem' }}>
                    Updated: {inquiry.updated_at.split('T')[0]}
                  </span>
                  <button
                    onClick={() => {
                      onSelectInquiry(inquiry);
                      onClose();
                    }}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 font-tabular"
                  >
                    <span>View Full Dossier</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
