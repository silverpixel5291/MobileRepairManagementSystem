import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Minus, Camera, Plus, Phone, User, Clock, Flag, Wrench, Package } from 'lucide-react';
import { Store } from '../store/useStore';
import { RepairJob, InitialCheckItem } from '../data/mockData';

// Device image mapping - using Unsplash for generic phone images
const getDeviceImage = (brand?: string, model?: string) => {
  const brandLower = brand?.toLowerCase() || '';
  
  // Brand-specific images
  if (brandLower.includes('iphone') || brandLower.includes('apple')) {
    return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=800&fit=crop';
  }
  if (brandLower.includes('samsung')) {
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=800&fit=crop';
  }
  if (brandLower.includes('oneplus')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=800&fit=crop';
  }
  if (brandLower.includes('xiaomi') || brandLower.includes('redmi')) {
    return 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=800&fit=crop';
  }
  if (brandLower.includes('vivo')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=800&fit=crop';
  }
  if (brandLower.includes('realme')) {
    return 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=800&fit=crop';
  }
  
  // Default phone image
  return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=800&fit=crop';
};

const CHECK_COMPONENTS = [
  'Physical condition',
  'Display',
  'Touch',
  'Camera',
  'Speaker',
  'Microphone',
  'Charging',
  'Buttons',
  'Network/SIM',
  'Wi-Fi/Bluetooth',
  'Battery',
  'Other',
];

const REPAIR_ACTIONS_LIST = [
  'Battery replacement',
  'Display replacement',
  'Charging-port repair',
  'Speaker replacement',
  'Camera replacement',
  'Software reset',
  'IC repair',
  'Water-damage treatment',
  'Cleaning',
  'Other/custom repair',
];

interface RepairWorkspaceProps {
  job: RepairJob;
  onClose: () => void;
  store: Store;
  techName: string;
}

export function RepairWorkspace({ job, onClose, store, techName }: RepairWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<string>('initial');
  
  // Initialize workspace data from job or create defaults
  const [initialCheck, setInitialCheck] = useState<InitialCheckItem[]>(
    job.initialCheck || CHECK_COMPONENTS.map(c => ({ component: c, status: null }))
  );
  
  const [diagnosis, setDiagnosis] = useState(job.diagnosis || {
    problems: [],
    rootCause: '',
    observations: '',
    result: '',
  });
  
  const [repairActions, setRepairActions] = useState(
    job.repairActions || REPAIR_ACTIONS_LIST.map(a => ({ action: a, selected: false }))
  );
  
  const [partsRequested, setPartsRequested] = useState(job.partsRequested || []);
  const [photos, setPhotos] = useState(job.photos || []);
  const [technicianNotes, setTechnicianNotes] = useState(job.technicianNotes || '');
  
  const [showPartSearch, setShowPartSearch] = useState(false);
  const [partSearch, setPartSearch] = useState('');
  const [newPhotoType, setNewPhotoType] = useState<'before' | 'during' | 'after'>('before');

  const deviceImage = getDeviceImage(job.deviceBrand, job.deviceModel);

  const handleInitialCheckChange = (component: string, status: 'pass' | 'fail' | 'issue' | 'na') => {
    const updated = initialCheck.map(item => 
      item.component === component ? { ...item, status } : item
    );
    setInitialCheck(updated);
    store.updateRepairInitialCheck(job.id, updated);
  };

  const handleDiagnosisSave = () => {
    store.updateRepairDiagnosis(job.id, diagnosis);
    store.showToast('Diagnosis saved', 'success');
  };

  const handleRepairActionsSave = () => {
    store.updateRepairActions(job.id, repairActions);
    store.showToast('Repair actions saved', 'success');
  };

  const handleAddPart = (part: any) => {
    const partRequest = {
      partId: part.id,
      partName: part.name,
      compatibleModel: job.deviceModel,
      availableQuantity: part.quantity,
      rack: part.rack,
      box: part.box,
      deviceId: part.deviceId,
      quantityRequired: 1,
      status: 'requested' as const,
    };
    
    const updated: any[] = [...partsRequested, partRequest];
    setPartsRequested(updated);
    store.addPartRequest(job.id, partRequest);
    setShowPartSearch(false);
    setPartSearch('');
  };

  const handleAddPhoto = () => {
    // Simulate photo upload - in real app this would use camera/file input
    const mockPhoto = {
      type: newPhotoType,
      url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
      timestamp: new Date().toISOString(),
      note: `${newPhotoType.charAt(0).toUpperCase() + newPhotoType.slice(1)} repair photo`,
    };
    
    const updated: any[] = [...photos, mockPhoto];
    setPhotos(updated);
    store.addRepairPhoto(job.id, mockPhoto);
  };

  const handleSaveNotes = () => {
    store.updateTechnicianNotes(job.id, technicianNotes);
    store.showToast('Notes saved', 'success');
  };

  const getStatusAction = (status: string) => {
    const actions: Record<string, { label: string; color: string; nextStatus: string; message: string }> = {
      received: { label: 'Start Diagnosis', color: 'bg-blue-500', nextStatus: 'diagnosing', message: 'Started diagnosis' },
      diagnosing: { label: 'Mark Diagnosed', color: 'bg-purple-500', nextStatus: 'estimate_generated', message: 'Diagnosis complete' },
      estimate_generated: { label: 'Mark Approved', color: 'bg-indigo-500', nextStatus: 'approved', message: 'Estimate approved by customer' },
      approved: { label: 'Start Work', color: 'bg-amber-500', nextStatus: 'working', message: 'Started repair work' },
      working: { label: 'Quality Check', color: 'bg-teal-500', nextStatus: 'quality_check', message: 'Repair completed, in quality check' },
      waiting_parts: { label: 'Parts Received', color: 'bg-amber-500', nextStatus: 'working', message: 'Parts received, resuming work' },
      quality_check: { label: 'Ready for Pickup', color: 'bg-mint-500', nextStatus: 'ready_pickup', message: 'Quality check passed, ready for pickup' },
    };
    return actions[status];
  };

  const action = getStatusAction(job.status);

  const sections = [
    { id: 'initial', label: '01 Initial Check', icon: CheckCircle },
    { id: 'diagnosis', label: '02 Diagnosis', icon: AlertCircle },
    { id: 'repair', label: '03 Repair Required', icon: Wrench },
    { id: 'parts', label: '04 Parts Required', icon: Package },
    { id: 'photos', label: '05 Photos & Notes', icon: Camera },
  ];

  return (
    <div className="fixed inset-0 z-[80] bg-navy-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-navy-200 shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-navy-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-navy-600" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-navy-900">{job.repairNumber}</h2>
              <p className="text-xs text-navy-500">{job.deviceName}</p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            job.status === 'working' ? 'bg-amber-100 text-amber-700' :
            job.status === 'quality_check' ? 'bg-teal-100 text-teal-700' :
            job.status === 'ready_pickup' ? 'bg-mint-100 text-mint-700' :
            'bg-navy-100 text-navy-700'
          }`}>
            {job.status.replace(/_/g, ' ').toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-20">
        {/* Device Info Header */}
        <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Device Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-navy-100 rounded-lg overflow-hidden">
                <img 
                  src={deviceImage} 
                  alt={job.deviceName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=800&fit=crop';
                  }}
                />
              </div>
            </div>

            {/* Device Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-navy-900">{job.deviceBrand} {job.deviceModel}</h3>
                <p className="text-sm text-navy-500">{job.deviceName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-500">Customer</p>
                    <p className="text-sm font-medium text-navy-900">{job.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-500">Phone</p>
                    <p className="text-sm font-medium text-navy-900">{job.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flag size={16} className="text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-500">Priority</p>
                    <p className={`text-sm font-semibold capitalize ${
                      job.priority === 'urgent' ? 'text-rose-600' :
                      job.priority === 'high' ? 'text-amber-600' :
                      'text-navy-700'
                    }`}>{job.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-navy-400" />
                  <div>
                    <p className="text-xs text-navy-500">Received</p>
                    <p className="text-sm font-medium text-navy-900">
                      {new Date(job.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-100">
                <p className="text-xs text-navy-500 mb-1">Reported Issue</p>
                <p className="text-sm text-navy-800">{job.problem}</p>
              </div>

              {job.estimate && (
                <div className="pt-4 border-t border-navy-100">
                  <p className="text-xs text-navy-500 mb-1">Estimate</p>
                  <p className="text-lg font-bold text-navy-900">₹{job.estimate.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-xl border border-navy-200 p-2 shadow-sm">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-500 text-white'
                    : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        {activeSection === 'initial' && (
          <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Initial Check</h3>
            <p className="text-sm text-navy-500 mb-6">Check each component and mark its status</p>
            
            <div className="space-y-3">
              {initialCheck.map((item) => (
                <div key={item.component} className="flex items-center justify-between py-3 border-b border-navy-50 last:border-0">
                  <span className="text-sm font-medium text-navy-800">{item.component}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInitialCheckChange(item.component, 'pass')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.status === 'pass'
                          ? 'bg-mint-500 text-white'
                          : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                      }`}
                    >
                      <CheckCircle size={14} className="inline mr-1" />
                      Pass
                    </button>
                    <button
                      onClick={() => handleInitialCheckChange(item.component, 'fail')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.status === 'fail'
                          ? 'bg-rose-500 text-white'
                          : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                      }`}
                    >
                      <XCircle size={14} className="inline mr-1" />
                      Fail
                    </button>
                    <button
                      onClick={() => handleInitialCheckChange(item.component, 'issue')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.status === 'issue'
                          ? 'bg-amber-500 text-white'
                          : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                      }`}
                    >
                      <AlertCircle size={14} className="inline mr-1" />
                      Issue
                    </button>
                    <button
                      onClick={() => handleInitialCheckChange(item.component, 'na')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        item.status === 'na'
                          ? 'bg-navy-500 text-white'
                          : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
                      }`}
                    >
                      <Minus size={14} className="inline mr-1" />
                      N/A
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'diagnosis' && (
          <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Diagnosis</h3>
            
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Diagnosed Problems</label>
              <input
                type="text"
                value={diagnosis.problems.join(', ')}
                onChange={(e) => setDiagnosis({ ...diagnosis, problems: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
                placeholder="e.g., Water damage, Display failure"
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Root Cause</label>
              <textarea
                value={diagnosis.rootCause}
                onChange={(e) => setDiagnosis({ ...diagnosis, rootCause: e.target.value })}
                placeholder="Describe the root cause of the issue..."
                rows={2}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Additional Observations</label>
              <textarea
                value={diagnosis.observations}
                onChange={(e) => setDiagnosis({ ...diagnosis, observations: e.target.value })}
                placeholder="Any additional observations..."
                rows={2}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Diagnosis Result</label>
              <input
                type="text"
                value={diagnosis.result}
                onChange={(e) => setDiagnosis({ ...diagnosis, result: e.target.value })}
                placeholder="e.g., Display replacement required"
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <button
              onClick={handleDiagnosisSave}
              className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
            >
              Save Diagnosis
            </button>
          </div>
        )}

        {activeSection === 'repair' && (
          <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Repair Required</h3>
            <p className="text-sm text-navy-500 mb-6">Select all repairs needed for this device</p>
            
            <div className="space-y-2">
              {repairActions.map((action, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    action.selected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-navy-200 hover:border-navy-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={action.selected}
                    onChange={(e) => {
                      const updated = repairActions.map((a, i) => 
                        i === idx ? { ...a, selected: e.target.checked } : a
                      );
                      setRepairActions(updated);
                    }}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-navy-800">{action.action}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleRepairActionsSave}
              className="w-full mt-6 px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
            >
              Save Repair Actions
            </button>
          </div>
        )}

        {activeSection === 'parts' && (
          <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy-900 mb-4">Parts Required</h3>
            
            {partsRequested.length > 0 && (
              <div className="space-y-3 mb-6">
                {partsRequested.map((part, idx) => (
                  <div key={idx} className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{part.partName}</p>
                        {part.compatibleModel && (
                          <p className="text-xs text-navy-500 mt-1">Compatible: {part.compatibleModel}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        part.status === 'requested' ? 'bg-amber-100 text-amber-700' :
                        part.status === 'approved' ? 'bg-primary-100 text-primary-700' :
                        'bg-mint-100 text-mint-700'
                      }`}>
                        {part.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-navy-600">
                      <span>Available: {part.availableQuantity}</span>
                      {part.rack && <span>Rack: {part.rack}</span>}
                      {part.box && <span>Box: {part.box}</span>}
                      <span>Required: {part.quantityRequired}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowPartSearch(true)}
              className="w-full px-4 py-3 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Required Part
            </button>

            {/* Part Search Modal */}
            {showPartSearch && (
              <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPartSearch(false)}>
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-navy-900">Search Parts</h3>
                    <input
                      type="text"
                      value={partSearch}
                      onChange={(e) => setPartSearch(e.target.value)}
                      placeholder="Search by part name..."
                      className="w-full mt-3 px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400"
                      autoFocus
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    {store.inventory
                      .filter(i => i.category === 'spare_part' && i.name.toLowerCase().includes(partSearch.toLowerCase()))
                      .map(part => (
                        <button
                          key={part.id}
                          onClick={() => handleAddPart(part)}
                          className="w-full text-left p-4 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                        >
                          <p className="text-sm font-semibold text-navy-900">{part.name}</p>
                          <div className="flex gap-4 mt-2 text-xs text-navy-600">
                            <span>Available: {part.quantity}</span>
                            {part.rack && <span>Rack: {part.rack}</span>}
                            {part.box && <span>Box: {part.box}</span>}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'photos' && (
          <div className="space-y-6">
            {/* Photos Section */}
            <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Photos</h3>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.note}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                        photo.type === 'before' ? 'bg-blue-500 text-white' :
                        photo.type === 'during' ? 'bg-amber-500 text-white' :
                        'bg-mint-500 text-white'
                      }`}>
                        {photo.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <select
                  value={newPhotoType}
                  onChange={(e) => setNewPhotoType(e.target.value as any)}
                  className="px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400"
                >
                  <option value="before">Before Repair</option>
                  <option value="during">During Repair</option>
                  <option value="after">After Repair</option>
                </select>
                <button
                  onClick={handleAddPhoto}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center justify-center gap-2"
                >
                  <Camera size={16} />
                  Add Photo
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Technician Notes</h3>
              <textarea
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="Add any notes about the repair..."
                rows={4}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
              />
              <button
                onClick={handleSaveNotes}
                className="w-full mt-4 px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}

        {/* Status Update */}
        {action && (
          <div className="bg-white rounded-xl border border-navy-200 p-6 shadow-sm">
            <button
              onClick={() => {
                store.updateRepairStatus(job.id, action.nextStatus, action.message, techName);
              }}
              className={`w-full px-6 py-4 ${action.color} text-white rounded-lg text-base font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
            >
              {action.label}
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
