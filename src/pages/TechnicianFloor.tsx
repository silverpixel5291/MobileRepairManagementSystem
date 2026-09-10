import { useState } from 'react';
import { Wrench, Clock, AlertCircle, CheckCircle, RefreshCw, User, ChevronRight, Camera } from 'lucide-react';
import { Store } from '../store/useStore';
import { technicians } from '../data/mockData';

export function TechnicianFloor({ store }: { store: Store }) {
  const [selectedTech, setSelectedTech] = useState('tech1');
  const [showNoteModal, setShowNoteModal] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const myJobs = store.repairs.filter(j => j.assignedTo === selectedTech);
  const working = myJobs.filter(j => j.status === 'working').length;
  const waitingParts = myJobs.filter(j => j.status === 'waiting_parts').length;
  const readyForPickup = myJobs.filter(j => j.status === 'ready_pickup').length;
  const completedToday = myJobs.filter(j => {
    const today = new Date().toDateString();
    return j.status === 'delivered' && new Date(j.updatedAt).toDateString() === today;
  }).length;

  const getStatusAction = (status: string) => {
    const actions: Record<string, { label: string; color: string; nextStatus: string; message: string }> = {
      received: { label: 'Start Diagnosis', color: 'bg-blue-500', nextStatus: 'diagnosing', message: 'Started diagnosis' },
      diagnosing: { label: 'Generate Estimate', color: 'bg-purple-500', nextStatus: 'estimate_generated', message: 'Estimate generated' },
      estimate_generated: { label: 'Mark Approved', color: 'bg-indigo-500', nextStatus: 'approved', message: 'Estimate approved by customer' },
      approved: { label: 'Start Work', color: 'bg-amber-500', nextStatus: 'working', message: 'Started repair work' },
      working: { label: 'Quality Check', color: 'bg-teal-500', nextStatus: 'quality_check', message: 'Repair completed, in quality check' },
      waiting_parts: { label: 'Parts Received', color: 'bg-amber-500', nextStatus: 'working', message: 'Parts received, resuming work' },
      quality_check: { label: 'Ready for Pickup', color: 'bg-mint-500', nextStatus: 'ready_pickup', message: 'Quality check passed, ready for pickup' },
    };
    return actions[status];
  };

  const techName = technicians.find(t => t.id === selectedTech)?.name || 'Technician';

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'border-navy-200 bg-navy-50', diagnosing: 'border-blue-200 bg-blue-50',
      estimate_generated: 'border-purple-200 bg-purple-50', approved: 'border-indigo-200 bg-indigo-50',
      working: 'border-amber-200 bg-amber-50', waiting_parts: 'border-orange-200 bg-orange-50',
      quality_check: 'border-teal-200 bg-teal-50', ready_pickup: 'border-mint-200 bg-mint-50',
      delivered: 'border-green-200 bg-green-50',
    };
    return colors[status] || 'border-navy-200 bg-navy-50';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Technician Floor</h1>
          <p className="text-sm text-navy-500">Manage repair assignments and workflow</p>
        </div>
        <button onClick={() => {
          setRefreshKey(prev => prev + 1);
          store.showToast('Data refreshed', 'info');
        }} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50"><RefreshCw size={16} />Refresh</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {technicians.map(tech => {
          const techJobs = store.repairs.filter(j => j.assignedTo === tech.id);
          const techCompleted = techJobs.filter(j => {
            const today = new Date().toDateString();
            return j.status === 'delivered' && new Date(j.updatedAt).toDateString() === today;
          }).length;
          return (
            <button key={tech.id} onClick={() => setSelectedTech(tech.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-w-max ${selectedTech === tech.id ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-navy-100 bg-white hover:border-navy-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTech === tech.id ? 'bg-primary-500 text-white' : 'bg-navy-100 text-navy-500'}`}><User size={16} /></div>
              <div className="text-left"><p className="text-sm font-semibold text-navy-900">{tech.name}</p><p className="text-xs text-navy-500">{techJobs.length} assigned • {techCompleted} done today</p></div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center"><Wrench size={14} className="text-navy-600" /></div><span className="text-xs text-navy-500">My Queue</span></div><p className="text-2xl font-bold text-navy-900">{myJobs.length}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><Clock size={14} className="text-amber-600" /></div><span className="text-xs text-navy-500">Working</span></div><p className="text-2xl font-bold text-amber-600">{working}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center"><AlertCircle size={14} className="text-orange-600" /></div><span className="text-xs text-navy-500">Waiting Parts</span></div><p className="text-2xl font-bold text-orange-600">{waitingParts}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-mint-100 flex items-center justify-center"><CheckCircle size={14} className="text-mint-600" /></div><span className="text-xs text-navy-500">Ready</span></div><p className="text-2xl font-bold text-mint-600">{readyForPickup}</p></div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-700">Assigned Repairs</h2>
        {myJobs.map(job => {
          const action = getStatusAction(job.status);
          return (
            <div 
              key={job.id} 
              className={`bg-white rounded-xl border-2 ${getStatusColor(job.status)} p-4 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-navy-900">{job.repairNumber}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${job.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : job.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-600'}`}>{job.priority}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${getStatusColor(job.status).split(' ')[0]} border`}>
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-navy-700 mt-1">{job.customerName} • {job.deviceName}</p>
                  <p className="text-xs text-navy-500 mt-0.5">{job.problem}</p>
                  {job.timeline.length > 0 && (
                    <div className="mt-2 bg-white/60 rounded-lg px-3 py-2">
                      <p className="text-xs text-navy-600"><span className="font-medium">Latest:</span> {job.timeline[job.timeline.length - 1].message}</p>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {job.estimate && <p className="text-sm font-semibold text-navy-800">₹{job.estimate.toLocaleString()}</p>}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-3 pt-3 border-t border-navy-100 flex flex-wrap gap-2">
                {action && (
                  <button
                    onClick={() => {
                      store.updateRepairStatus(job.id, action.nextStatus, action.message, techName);
                      setRefreshKey(prev => prev + 1);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}
                  >
                    {action.label}
                    <ChevronRight size={14} />
                  </button>
                )}
                <button
                  onClick={() => setShowNoteModal(job.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-navy-200 text-navy-700 rounded-lg text-xs font-medium hover:bg-navy-50 transition-colors"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setShowPhotoModal(job.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-navy-200 text-navy-700 rounded-lg text-xs font-medium hover:bg-navy-50 transition-colors"
                >
                  <Camera size={14} />
                  Photo
                </button>
              </div>
            </div>
          );
        })}
        {myJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-navy-100"><CheckCircle size={48} className="mx-auto text-mint-300 mb-3" /><p className="text-navy-500">No jobs assigned. All caught up!</p></div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => {
            setShowNoteModal(null);
            setNoteText('');
          }} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-5 animate-fade-in">
            <h3 className="text-lg font-bold text-navy-900 mb-3">Add Note</h3>
            <textarea 
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              rows={4}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => {
                setShowNoteModal(null);
                setNoteText('');
              }} className="px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">Cancel</button>
              <button 
                onClick={() => {
                  if (noteText.trim() && showNoteModal) {
                    store.addRepairNote(showNoteModal, noteText, techName);
                    setShowNoteModal(null);
                    setNoteText('');
                    setRefreshKey(prev => prev + 1);
                  }
                }}
                disabled={!noteText.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPhotoModal(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-5 animate-fade-in">
            <h3 className="text-lg font-bold text-navy-900 mb-3">Upload Photo</h3>
            <div className="border-2 border-dashed border-navy-200 rounded-lg p-8 text-center mb-4">
              <Camera size={48} className="mx-auto text-navy-300 mb-3" />
              <p className="text-sm text-navy-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-navy-400">PNG, JPG up to 10MB</p>
              <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => {
                if (e.target.files && e.target.files[0] && showPhotoModal) {
                  const fileName = e.target.files[0].name;
                  store.addRepairNote(showPhotoModal, `📷 Photo uploaded: ${fileName}`, techName);
                  setShowPhotoModal(null);
                  setRefreshKey(prev => prev + 1);
                }
              }} />
              <label htmlFor="photo-upload" className="inline-block mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 cursor-pointer">
                Choose File
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPhotoModal(null)} className="px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
