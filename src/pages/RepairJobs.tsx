import { useState } from 'react';
import { Plus, Clock, User, ExternalLink, ChevronRight, Search, Filter } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, textareaClass, SubmitButton } from '../components/Modal';
import { Store } from '../store/useStore';
import { RepairJob, Priority, RepairStatus } from '../data/mockData';

export function RepairJobs({ store }: { store: Store }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    customerId: '', customerName: '', customerPhone: '', deviceId: '', deviceName: '',
    problem: '', priority: 'medium' as Priority, status: 'received' as RepairStatus,
    estimate: 0, assignedTo: '', assignedToName: '', internalNotes: '',
  });
  const [createNewCustomer, setCreateNewCustomer] = useState(false);

  // Combined filtering logic
  const filtered = store.repairs.filter(j => {
    // Status filter
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    
    // Technician filter
    if (technicianFilter !== 'all' && j.assignedTo !== technicianFilter) return false;
    
    // Priority filter
    if (priorityFilter !== 'all' && j.priority !== priorityFilter) return false;
    
    // Search query (searches repair number, customer name, device name, problem)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesRepairNumber = j.repairNumber.toLowerCase().includes(query);
      const matchesCustomerName = j.customerName.toLowerCase().includes(query);
      const matchesDeviceName = j.deviceName?.toLowerCase().includes(query);
      const matchesProblem = j.problem.toLowerCase().includes(query);
      
      if (!matchesRepairNumber && !matchesCustomerName && !matchesDeviceName && !matchesProblem) {
        return false;
      }
    }
    
    return true;
  });

  const statusCounts = {
    all: store.repairs.length,
    received: store.repairs.filter(j => j.status === 'received').length,
    diagnosing: store.repairs.filter(j => j.status === 'diagnosing').length,
    working: store.repairs.filter(j => j.status === 'working').length,
    waiting_parts: store.repairs.filter(j => j.status === 'waiting_parts').length,
    ready_pickup: store.repairs.filter(j => j.status === 'ready_pickup').length,
    delivered: store.repairs.filter(j => j.status === 'delivered').length,
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
    const colors: Record<string, string> = { low: 'text-navy-500', medium: 'text-blue-600', high: 'text-amber-600', urgent: 'text-rose-600' };
    return colors[priority] || 'text-navy-500';
  };

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const handleCustomerSelect = (custId: string) => {
    const cust = store.customers.find(c => c.id === custId);
    if (cust) setForm({ ...form, customerId: cust.id, customerName: cust.name, customerPhone: cust.phone });
  };

  const handleSubmit = () => {
    if (!form.customerName || !form.customerPhone || !form.problem) return;
    
    // If creating new customer, add them first
    let customerId = form.customerId;
    if (createNewCustomer) {
      const newCustomer = store.addCustomer({
        name: form.customerName,
        phone: form.customerPhone,
        email: '',
        address: '',
        gstin: '',
        type: 'individual',
      });
      customerId = newCustomer.id;
    }
    
    store.addRepair({ ...form, customerId });
    setForm({ customerId: '', customerName: '', customerPhone: '', deviceId: '', deviceName: '', problem: '', priority: 'medium', status: 'received', estimate: 0, assignedTo: '', assignedToName: '', internalNotes: '' });
    setCreateNewCustomer(false);
    setShowAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Repair Jobs</h1>
          <p className="text-sm text-navy-500">{filtered.length} of {statusCounts.all} jobs</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} /> New Repair Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={18} className="text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by repair number, customer, device, or problem..."
            className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-navy-400 hover:text-navy-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-navy-400" />
            <span className="text-xs text-navy-500">Filters:</span>
          </div>
          
          <select
            value={technicianFilter}
            onChange={(e) => setTechnicianFilter(e.target.value)}
            className="px-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none focus:border-primary-400"
          >
            <option value="all">All Technicians</option>
            <option value="tech1">Vikram Singh</option>
            <option value="tech2">Ravi Kumar</option>
            <option value="unassigned">Unassigned</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none focus:border-primary-400"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {(searchQuery || technicianFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTechnicianFilter('all');
                setPriorityFilter('all');
                setStatusFilter('all');
              }}
              className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm hover:bg-rose-100 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-2 shadow-sm overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {[
            { key: 'all', label: 'All' }, { key: 'received', label: 'Received' },
            { key: 'diagnosing', label: 'Diagnosing' }, { key: 'working', label: 'Working' },
            { key: 'waiting_parts', label: 'Waiting Parts' }, { key: 'ready_pickup', label: 'Ready' },
            { key: 'delivered', label: 'Delivered' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === tab.key ? 'bg-primary-500 text-white shadow-sm' : 'text-navy-600 hover:bg-navy-50'}`}>
              {tab.label}
              <span className={`ml-1.5 text-xs ${statusFilter === tab.key ? 'text-primary-200' : 'text-navy-400'}`}>{statusCounts[tab.key as keyof typeof statusCounts] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedJob(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-lg font-bold text-navy-900">{selectedJob.repairNumber}</h2><p className="text-sm text-navy-500">{selectedJob.deviceName}</p></div>
                <button onClick={() => setSelectedJob(null)} className="p-1 hover:bg-navy-100 rounded text-navy-500">✕</button>
              </div>
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(selectedJob.status)} mb-4`}>{formatStatus(selectedJob.status)}</div>
              <div className="space-y-3 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-50 rounded-lg p-3"><p className="text-xs text-navy-500">Customer</p><p className="text-sm font-medium text-navy-800">{selectedJob.customerName}</p><p className="text-xs text-navy-500">{selectedJob.customerPhone}</p></div>
                  <div className="bg-navy-50 rounded-lg p-3"><p className="text-xs text-navy-500">Priority</p><p className={`text-sm font-medium capitalize ${getPriorityColor(selectedJob.priority)}`}>{selectedJob.priority}</p>{selectedJob.estimate && <p className="text-xs text-navy-500 mt-1">Est: ₹{selectedJob.estimate.toLocaleString()}</p>}</div>
                </div>
                <div className="bg-navy-50 rounded-lg p-3"><p className="text-xs text-navy-500">Problem</p><p className="text-sm text-navy-800">{selectedJob.problem}</p></div>
                {selectedJob.assignedToName && <div className="flex items-center gap-2 bg-navy-50 rounded-lg p-3"><User size={16} className="text-navy-500" /><div><p className="text-xs text-navy-500">Assigned Technician</p><p className="text-sm font-medium text-navy-800">{selectedJob.assignedToName}</p></div></div>}
              </div>
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
              <div className="mt-5 pt-4 border-t border-navy-100 space-y-2">
                <button className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">Update Status</button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Add Note</button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100"><ExternalLink size={14} />Tracking Link</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-navy-900">{job.repairNumber}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(job.status)}`}>{formatStatus(job.status)}</span>
                  <span className={`text-[10px] font-medium capitalize ${getPriorityColor(job.priority)}`}>● {job.priority}</span>
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
        <div className="text-center py-12"><Clock size={48} className="mx-auto text-navy-200 mb-3" /><p className="text-navy-500">No repair jobs found.</p></div>
      )}

      {/* New Repair Job Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Repair Job" subtitle="Create a repair ticket for a customer device">
        <div className="space-y-4">
          <div className="bg-navy-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-700">Customer</span>
              <button type="button" onClick={() => setCreateNewCustomer(!createNewCustomer)} className="text-xs text-primary-600 font-medium hover:text-primary-700">
                {createNewCustomer ? '← Select existing' : '+ Create new'}
              </button>
            </div>
            {createNewCustomer ? (
              <FormRow>
                <FormField label="Name" required>
                  <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" className={inputClass} />
                </FormField>
                <FormField label="Phone" required>
                  <input type="tel" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                </FormField>
              </FormRow>
            ) : (
              <select value={form.customerId} onChange={e => handleCustomerSelect(e.target.value)} className={selectClass}>
                <option value="">Select existing customer...</option>
                {store.customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            )}
          </div>
          {!createNewCustomer && (
            <FormRow>
              <FormField label="Customer Name" required>
                <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Walk-in customer name" className={inputClass} />
              </FormField>
              <FormField label="Phone Number" required>
                <input type="tel" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
              </FormField>
            </FormRow>
          )}
          <FormRow>
            <FormField label="Device Name">
              <input type="text" value={form.deviceName} onChange={e => setForm({ ...form, deviceName: e.target.value })} placeholder="e.g. iPhone 13" className={inputClass} />
            </FormField>
            <FormField label="Linked Inventory Item">
              <select value={form.deviceId} onChange={e => {
                const item = store.inventory.find(i => i.id === e.target.value);
                setForm({ ...form, deviceId: e.target.value, deviceName: item?.name || form.deviceName });
              }} className={selectClass}>
                <option value="">None (walk-in device)</option>
                {store.inventory.filter(i => i.category === 'mobile').map(i => <option key={i.id} value={i.id}>{i.name} ({i.deviceId})</option>)}
              </select>
            </FormField>
          </FormRow>
          <FormField label="Problem / Complaint" required>
            <textarea value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} placeholder="Describe the issue reported by the customer..." rows={3} className={textareaClass} />
          </FormField>
          <FormRow cols={3}>
            <FormField label="Priority">
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })} className={selectClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </FormField>
            <FormField label="Estimate (₹)">
              <input type="number" value={form.estimate || ''} onChange={e => setForm({ ...form, estimate: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
            <FormField label="Assign Technician">
              <select value={form.assignedTo} onChange={e => {
                const tech = e.target.value;
                const names: Record<string, string> = { tech1: 'Vikram Singh', tech2: 'Ravi Kumar' };
                setForm({ ...form, assignedTo: tech, assignedToName: names[tech] || '' });
              }} className={selectClass}>
                <option value="">Unassigned</option>
                <option value="tech1">Vikram Singh</option>
                <option value="tech2">Ravi Kumar</option>
              </select>
            </FormField>
          </FormRow>
          <FormField label="Internal Notes">
            <textarea value={form.internalNotes} onChange={e => setForm({ ...form, internalNotes: e.target.value })} placeholder="Notes visible only to staff..." rows={2} className={textareaClass} />
          </FormField>
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Create Repair Job</SubmitButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
