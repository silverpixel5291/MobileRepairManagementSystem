import { useState } from 'react';
import { Plus, Search, Store, Phone, Mail, MapPin, IndianRupee, X } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, SubmitButton } from '../components/Modal';
import { Store as StoreType } from '../store/useStore';
import { Supplier } from '../data/mockData';

export function Suppliers({ store }: { store: StoreType }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState({
    code: '', name: '', phone: '', email: '', city: '', address: '', gstin: '',
    openingBalance: 0, currentBalance: 0, totalOrders: 0,
  });

  const filtered = store.suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayable = store.suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.code) return;
    store.addSupplier(form);
    setForm({ code: '', name: '', phone: '', email: '', city: '', address: '', gstin: '', openingBalance: 0, currentBalance: 0, totalOrders: 0 });
    setShowAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Suppliers</h1>
          <p className="text-sm text-navy-500">{store.suppliers.length} suppliers • ₹{totalPayable.toLocaleString()} total payable</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-navy-400" />
          <input type="text" placeholder="Search by name, code, or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(supplier => (
          <div 
            key={supplier.id} 
            onClick={() => setSelectedSupplier(supplier)}
            className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Store size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{supplier.name}</p>
                  <p className="text-xs text-navy-400">{supplier.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-navy-900">₹{supplier.currentBalance.toLocaleString()}</p>
                <p className="text-xs text-navy-500">Payable</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-navy-600"><Phone size={14} className="text-navy-400" />{supplier.phone}</div>
              {supplier.email && <div className="flex items-center gap-2 text-sm text-navy-600"><Mail size={14} className="text-navy-400" /><span className="truncate">{supplier.email}</span></div>}
              <div className="flex items-center gap-2 text-sm text-navy-600"><MapPin size={14} className="text-navy-400" />{supplier.city}</div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-navy-50">
              <div className="flex items-center gap-1 text-xs text-navy-500"><IndianRupee size={12} />{supplier.totalOrders} orders</div>
              {supplier.gstin && <span className="text-xs bg-navy-50 text-navy-500 px-2 py-0.5 rounded">GSTIN: {supplier.gstin}</span>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><Store size={48} className="mx-auto text-navy-200 mb-3" /><p className="text-navy-500">No suppliers found.</p></div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Supplier" subtitle="Create a new supplier record">
        <div className="space-y-4">
          <FormRow>
            <FormField label="Supplier Code" required>
              <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SUP-005" className={inputClass} />
            </FormField>
            <FormField label="Supplier Name" required>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Company name" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Phone" required>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </FormField>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@supplier.com" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="City" required>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputClass} />
            </FormField>
            <FormField label="GSTIN">
              <input type="text" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="Optional" className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={inputClass} />
          </FormField>
          <FormField label="Opening Balance (₹)">
            <input type="number" value={form.openingBalance} onChange={e => setForm({ ...form, openingBalance: Number(e.target.value), currentBalance: Number(e.target.value) })} placeholder="0" className={inputClass} />
          </FormField>
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Add Supplier</SubmitButton>
          </div>
        </div>
      </Modal>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedSupplier(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Store size={24} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{selectedSupplier.name}</h2>
                  <p className="text-sm text-navy-500">{selectedSupplier.code}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={20} className="text-navy-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-navy-500" />
                    <span className="text-sm font-medium text-navy-700">Phone</span>
                  </div>
                  <p className="text-base text-navy-900">{selectedSupplier.phone}</p>
                </div>
                {selectedSupplier.email && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-navy-500" />
                      <span className="text-sm font-medium text-navy-700">Email</span>
                    </div>
                    <p className="text-base text-navy-900">{selectedSupplier.email}</p>
                  </div>
                )}
                <div className="bg-navy-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-navy-500" />
                    <span className="text-sm font-medium text-navy-700">City</span>
                  </div>
                  <p className="text-base text-navy-900">{selectedSupplier.city}</p>
                </div>
                {selectedSupplier.address && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-navy-500" />
                      <span className="text-sm font-medium text-navy-700">Address</span>
                    </div>
                    <p className="text-base text-navy-900">{selectedSupplier.address}</p>
                  </div>
                )}
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rose-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-rose-700">₹{selectedSupplier.currentBalance.toLocaleString()}</p>
                  <p className="text-sm text-navy-600 mt-1">Current Payable</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700">₹{selectedSupplier.openingBalance.toLocaleString()}</p>
                  <p className="text-sm text-navy-600 mt-1">Opening Balance</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">{selectedSupplier.totalOrders}</p>
                  <p className="text-sm text-navy-600 mt-1">Total Orders</p>
                </div>
              </div>

              {/* GST Info */}
              {selectedSupplier.gstin && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">GST Information</h3>
                  <p className="text-sm text-navy-700"><span className="font-medium">GSTIN:</span> {selectedSupplier.gstin}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-navy-100">
                <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                  Create Purchase Order
                </button>
                <button className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
