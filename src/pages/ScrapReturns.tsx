import { useState } from 'react';
import { Trash2, RotateCcw, IndianRupee, X } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, textareaClass, SubmitButton } from '../components/Modal';
import { Store } from '../store/useStore';
import { ScrapRecord } from '../data/mockData';

export function ScrapReturns({ store }: { store: Store }) {
  const [showAddScrap, setShowAddScrap] = useState(false);
  const [selectedScrap, setSelectedScrap] = useState<ScrapRecord | null>(null);
  const [form, setForm] = useState({ itemName: '', category: 'mobile', quantity: 1, reason: '', recoveryValue: 0 });

  const totalRecovery = store.scrap.reduce((sum, s) => sum + s.recoveryValue, 0);
  const totalScrapQty = store.scrap.reduce((sum, s) => sum + s.quantity, 0);

  const handleSubmit = () => {
    if (!form.itemName || !form.reason || form.quantity <= 0) return;
    store.addScrap(form);
    setForm({ itemName: '', category: 'mobile', quantity: 1, reason: '', recoveryValue: 0 });
    setShowAddScrap(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Scrap & Returns</h1>
          <p className="text-sm text-navy-500">Manage scrapped items and sales returns</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50"><RotateCcw size={16} />New Return</button>
          <button onClick={() => setShowAddScrap(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm"><Trash2 size={16} />Record Scrap</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center"><Trash2 size={14} className="text-rose-600" /></div><span className="text-xs text-navy-500">Scrap Records</span></div><p className="text-2xl font-bold text-navy-900">{store.scrap.length}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center"><Trash2 size={14} className="text-navy-600" /></div><span className="text-xs text-navy-500">Total Qty Scrapped</span></div><p className="text-2xl font-bold text-navy-900">{totalScrapQty}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-mint-100 flex items-center justify-center"><IndianRupee size={14} className="text-mint-600" /></div><span className="text-xs text-navy-500">Recovery Value</span></div><p className="text-2xl font-bold text-mint-600">₹{totalRecovery.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><RotateCcw size={14} className="text-amber-600" /></div><span className="text-xs text-navy-500">Returns</span></div><p className="text-2xl font-bold text-navy-900">0</p></div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-navy-100">
          <h2 className="font-semibold text-navy-900">Scrap Register</h2>
          <span className="text-xs text-navy-500 bg-navy-50 px-2 py-1 rounded">{store.scrap.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Category</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Reason</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Recovery</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {store.scrap.map(record => (
                <tr key={record.id} onClick={() => setSelectedScrap(record)} className="hover:bg-navy-50/50 cursor-pointer">
                  <td className="px-4 py-3"><p className="font-medium text-navy-800">{record.itemName}</p></td>
                  <td className="px-4 py-3 text-navy-600 capitalize">{record.category.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-800">{record.quantity}</td>
                  <td className="px-4 py-3 text-navy-500 max-w-xs truncate">{record.reason}</td>
                  <td className="px-4 py-3 text-right font-medium text-mint-600">₹{record.recoveryValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-navy-500">{new Date(record.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-8 text-center">
        <RotateCcw size={48} className="mx-auto text-navy-200 mb-3" />
        <h3 className="font-semibold text-navy-700 mb-1">No Returns Recorded</h3>
        <p className="text-sm text-navy-500">Returns linked to original sales will appear here.</p>
      </div>

      {/* Record Scrap Modal */}
      <Modal open={showAddScrap} onClose={() => setShowAddScrap(false)} title="Record Scrap" subtitle="Mark items as scrapped and record recovery value">
        <div className="space-y-4">
          <FormField label="Item Name" required>
            <input type="text" value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} placeholder="e.g. Samsung Galaxy J7 (Dead)" className={inputClass} />
          </FormField>
          <FormRow>
            <FormField label="Category">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={selectClass}>
                <option value="mobile">Mobile Phone</option>
                <option value="spare_part">Spare Part</option>
                <option value="accessory">Accessory</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Quantity" required>
              <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} min={1} className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Scrap Reason" required>
            <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Why is this item being scrapped?" rows={2} className={textareaClass} />
          </FormField>
          <FormField label="Recovery Value (₹)">
            <input type="number" value={form.recoveryValue || ''} onChange={e => setForm({ ...form, recoveryValue: Number(e.target.value) })} placeholder="0" className={inputClass} />
          </FormField>
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAddScrap(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Record Scrap</SubmitButton>
          </div>
        </div>
      </Modal>

      {/* Scrap Detail Modal */}
      {selectedScrap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedScrap(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Trash2 size={24} className="text-rose-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{selectedScrap.itemName}</h2>
                  <p className="text-sm text-navy-500">Scrap Record</p>
                </div>
              </div>
              <button onClick={() => setSelectedScrap(null)} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={20} className="text-navy-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-50 rounded-lg p-4">
                  <p className="text-sm text-navy-600 mb-1">Category</p>
                  <p className="text-base font-medium text-navy-900 capitalize">{selectedScrap.category.replace('_', ' ')}</p>
                </div>
                <div className="bg-navy-50 rounded-lg p-4">
                  <p className="text-sm text-navy-600 mb-1">Quantity</p>
                  <p className="text-base font-medium text-navy-900">{selectedScrap.quantity}</p>
                </div>
                <div className="bg-mint-50 rounded-lg p-4">
                  <p className="text-sm text-navy-600 mb-1">Recovery Value</p>
                  <p className="text-2xl font-bold text-mint-700">₹{selectedScrap.recoveryValue.toLocaleString()}</p>
                </div>
                <div className="bg-navy-50 rounded-lg p-4">
                  <p className="text-sm text-navy-600 mb-1">Date Recorded</p>
                  <p className="text-base font-medium text-navy-900">{new Date(selectedScrap.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-700 mb-2">Scrap Reason</h3>
                <p className="text-base text-navy-800">{selectedScrap.reason}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-navy-100">
                <button className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">
                  Print Record
                </button>
                <button className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600">
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
