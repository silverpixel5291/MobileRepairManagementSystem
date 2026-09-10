import { useState } from 'react';
import { Wrench, Clock, AlertCircle, CheckCircle, RefreshCw, User, ChevronRight } from 'lucide-react';
import { Store } from '../store/useStore';
import { technicians } from '../data/mockData';

export function TechnicianFloor({ store }: { store: Store }) {
  const [selectedTech, setSelectedTech] = useState('tech1');

  const myJobs = store.repairs.filter(j => j.assignedTo === selectedTech);
  const working = myJobs.filter(j => j.status === 'working').length;
  const waitingParts = myJobs.filter(j => j.status === 'waiting_parts').length;
  const readyForPickup = myJobs.filter(j => j.status === 'ready_pickup').length;

  const getStatusAction = (status: string) => {
    const actions: Record<string, { label: string; color: string }> = {
      received: { label: 'Start Diagnosis', color: 'bg-blue-500' },
      diagnosing: { label: 'Generate Estimate', color: 'bg-purple-500' },
      estimate_generated: { label: 'Mark Approved', color: 'bg-indigo-500' },
      approved: { label: 'Start Work', color: 'bg-amber-500' },
      working: { label: 'Quality Check', color: 'bg-teal-500' },
      waiting_parts: { label: 'Parts Received', color: 'bg-amber-500' },
      quality_check: { label: 'Ready for Pickup', color: 'bg-mint-500' },
    };
    return actions[status];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'border-navy-200 bg-navy-50', diagnosing: 'border-blue-200 bg-blue-50',
      estimate_generated: 'border-purple-200 bg-purple-50', approved: 'border-indigo-200 bg-indigo-50',
      working: 'border-amber-200 bg-amber-50', waiting_parts: 'border-orange-200 bg-orange-50',
      quality_check: 'border-teal-200 bg-teal-50', ready_pickup: 'border-mint-200 bg-mint-50',
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
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50"><RefreshCw size={16} />Refresh</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {technicians.map(tech => (
          <button key={tech.id} onClick={() => setSelectedTech(tech.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all min-w-max ${selectedTech === tech.id ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-navy-100 bg-white hover:border-navy-200'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTech === tech.id ? 'bg-primary-500 text-white' : 'bg-navy-100 text-navy-500'}`}><User size={16} /></div>
            <div className="text-left"><p className="text-sm font-semibold text-navy-900">{tech.name}</p><p className="text-xs text-navy-500">{tech.assignedJobs} assigned • {tech.completedToday} done today</p></div>
          </button>
        ))}
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
            <div key={job.id} className={`bg-white rounded-xl border-2 ${getStatusColor(job.status)} p-4 shadow-sm`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-navy-900">{job.repairNumber}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${job.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : job.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-600'}`}>{job.priority}</span>
                  </div>
                  <p className="text-sm text-navy-700 mt-1">{job.customerName} • {job.deviceName}</p>
                  <p className="text-xs text-navy-500 mt-0.5">{job.problem}</p>
                  {job.timeline.length > 0 && (
                    <div className="mt-2 bg-white/60 rounded-lg px-3 py-2">
                      <p className="text-xs text-navy-600"><span className="font-medium">Latest:</span> {job.timeline[job.timeline.length - 1].message}</p>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">{job.estimate && <p className="text-sm font-semibold text-navy-800">₹{job.estimate.toLocaleString()}</p>}</div>
              </div>
              {action && (
                <div className="mt-3 pt-3 border-t border-navy-100/50 flex items-center gap-2">
                  <button className={`flex items-center gap-1.5 px-4 py-2 ${action.color} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}>{action.label}<ChevronRight size={14} /></button>
                  <button className="px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-600 hover:bg-navy-50">Add Note</button>
                  <button className="px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-600 hover:bg-navy-50">📷 Photo</button>
                </div>
              )}
            </div>
          );
        })}
        {myJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-navy-100"><CheckCircle size={48} className="mx-auto text-mint-300 mb-3" /><p className="text-navy-500">No jobs assigned. All caught up!</p></div>
        )}
      </div>
    </div>
  );
}
