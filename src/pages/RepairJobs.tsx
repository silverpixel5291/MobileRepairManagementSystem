import { useState } from 'react';
import { Plus, Clock, User, ExternalLink, ChevronRight } from 'lucide-react';
import { repairJobs, RepairJob } from '../data/mockData';

export function RepairJobs() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);

  const filtered = repairJobs.filter(j => statusFilter === 'all' || j.status === statusFilter);

  const statusCounts = {
    all: repairJobs.length,
    received: repairJobs.filter(j => j.status === 'received').length,
    diagnosing: repairJobs.filter(j => j.status === 'diagnosing').length,
    working: repairJobs.filter(j => j.status === 'working').length,
    waiting_parts: repairJobs.filter(j => j.status === 'waiting_parts').length,
    ready_pickup: repairJobs.filter(j => j.status === 'ready_pickup').length,
    delivered: repairJobs.filter(j => j.status === 'delivered').length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-navy-100 text-navy-700 border-navy-200',
      diagnosing: 'bg-blue-100 text-blue-700 border-blue-200',
      estimate_generated: 'bg-purple-100 text-purple-700 border-purple-200',
      approved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      working: 'bg-amber-100 text-amber-700 border-amber-200',
      waiting_parts: 'bg-orange-100 text-orange-700 border-orange-200',
      quality_check: 'bg-teal-100 text-teal-700 border-teal-200',
      ready_pickup: 'bg-mint-100 text-mint-700 border-mint-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cannot_repair: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-navy-500',
      medium: 'text-blue-600',
      high: 'text-amber-600',
      urgent: 'text-rose-600',
    };
    return colors[priority] || 'text-navy-500';
  };

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Repair Jobs</h1>
          <p className="text-sm text-navy-500">{statusCounts.all} total jobs • {statusCounts.working + statusCounts.waiting_parts} in progress</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} />
          New Repair Job
        </button>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl border border-navy-100 p-2 shadow-sm overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {[
            { key: 'all', label: 'All' },
            { key: 'received', label: 'Received' },
            { key: 'diagnosing', label: 'Diagnosing' },
            { key: 'working', label: 'Working' },
            { key: 'waiting_parts', label: 'Waiting Parts' },
            { key: 'ready_pickup', label: 'Ready' },
            { key: 'delivered', label: 'Delivered' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-navy-600 hover:bg-navy-50'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${statusFilter === tab.key ? 'text-primary-200' : 'text-navy-400'}`}>
                {statusCounts[tab.key as keyof typeof statusCounts] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedJob(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">{selectedJob.repairNumber}</h2>
                  <p className="text-sm text-navy-500">{selectedJob.deviceName}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-1 hover:bg-navy-100 rounded text-navy-500">✕</button>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(selectedJob.status)} mb-4`}>
                {formatStatus(selectedJob.status)}
              </div>

              {/* Job Info */}
              <div className="space-y-3 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-50 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Customer</p>
                    <p className="text-sm font-medium text-navy-800">{selectedJob.customerName}</p>
                    <p className="text-xs text-navy-500">{selectedJob.customerPhone}</p>
                  </div>
                  <div className="bg-navy-50 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Priority</p>
                    <p className={`text-sm font-medium capitalize ${getPriorityColor(selectedJob.priority)}`}>{selectedJob.priority}</p>
                    {selectedJob.estimate && <p className="text-xs text-navy-500 mt-1">Est: ₹{selectedJob.estimate.toLocaleString()}</p>}
                  </div>
                </div>

                <div className="bg-navy-50 rounded-lg p-3">
                  <p className="text-xs text-navy-500">Problem</p>
                  <p className="text-sm text-navy-800">{selectedJob.problem}</p>
                </div>

                {selectedJob.assignedToName && (
                  <div className="flex items-center gap-2 bg-navy-50 rounded-lg p-3">
                    <User size={16} className="text-navy-500" />
                    <div>
                      <p className="text-xs text-navy-500">Assigned Technician</p>
                      <p className="text-sm font-medium text-navy-800">{selectedJob.assignedToName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="border-t border-navy-100 pt-4">
                <h3 className="text-sm font-semibold text-navy-800 mb-3">Timeline</h3>
                <div className="space-y-3">
                  {selectedJob.timeline.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${idx === selectedJob.timeline.length - 1 ? 'bg-primary-500' : 'bg-navy-200'}`} />
                        {idx < selectedJob.timeline.length - 1 && <div className="w-0.5 flex-1 bg-navy-100 mt-1" />}
                      </div>
                      <div className="flex-1 pb-3">
                        <p className="text-sm font-medium text-navy-800">{entry.message}</p>
                        <p className="text-xs text-navy-400 mt-0.5">{entry.user} • {new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-navy-100 space-y-2">
                <button className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                  Update Status
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">
                    Add Note
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">
                    <ExternalLink size={14} />
                    Tracking Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-3">
        {filtered.map(job => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedJob(job)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-navy-900">{job.repairNumber}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>
                    {formatStatus(job.status)}
                  </span>
                  <span className={`text-[10px] font-medium capitalize ${getPriorityColor(job.priority)}`}>
                    ● {job.priority}
                  </span>
                </div>
                <p className="text-sm text-navy-700 mt-1.5 font-medium">{job.customerName} • {job.deviceName}</p>
                <p className="text-xs text-navy-500 mt-0.5 truncate">{job.problem}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-navy-400">
                  <span className="flex items-center gap-1"><Clock size={12} />{new Date(job.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  {job.assignedToName && <span className="flex items-center gap-1"><User size={12} />{job.assignedToName}</span>}
                  {job.estimate && <span className="font-medium text-navy-600">₹{job.estimate.toLocaleString()}</span>}
                </div>
              </div>
              <ChevronRight size={18} className="text-navy-300 shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No repair jobs found.</p>
        </div>
      )}
    </div>
  );
}
