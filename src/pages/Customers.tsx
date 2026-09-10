import { useState } from 'react';
import { Plus, Search, Users, Phone, Mail, Building } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, SubmitButton } from '../components/Modal';
import { Store } from '../store/useStore';

export function Customers({ store }: { store: Store }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', gstin: '', type: 'individual' as 'individual' | 'business', birthday: '' });

  const filtered = store.customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    store.addCustomer(form);
    setForm({ name: '', phone: '', email: '', address: '', gstin: '', type: 'individual', birthday: '' });
    setShowAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Customers</h1>
          <p className="text-sm text-navy-500">{store.customers.length} customers</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
            <Search size={16} className="text-navy-400" />
            <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none">
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customer.type === 'business' ? 'bg-purple-100 text-purple-600' : 'bg-primary-100 text-primary-600'}`}>
                  {customer.type === 'business' ? <Building size={18} /> : <Users size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{customer.name}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${customer.type === 'business' ? 'bg-purple-50 text-purple-600' : 'bg-navy-50 text-navy-500'}`}>{customer.type}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-navy-600"><Phone size={14} className="text-navy-400" />{customer.phone}</div>
              {customer.email && <div className="flex items-center gap-2 text-sm text-navy-600"><Mail size={14} className="text-navy-400" /><span className="truncate">{customer.email}</span></div>}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-navy-50 text-xs text-navy-500">
              <span>{customer.totalPurchases} purchases</span>
              <span>{customer.totalRepairs} repairs</span>
            </div>
            {customer.gstin && <div className="mt-2 text-xs bg-navy-50 rounded px-2 py-1 text-navy-500">GSTIN: {customer.gstin}</div>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No customers found.</p>
        </div>
      )}

      {/* Add Customer Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Customer" subtitle="Create a new customer record">
        <div className="space-y-4">
          <FormRow>
            <FormField label="Full Name" required>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter customer name" className={inputClass} />
            </FormField>
            <FormField label="Phone Number" required>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com (optional)" className={inputClass} />
            </FormField>
            <FormField label="Birthday">
              <input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Customer Type">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'individual' | 'business' })} className={selectClass}>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </FormField>
            <div></div>
          </FormRow>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={inputClass} />
          </FormField>
          {form.type === 'business' && (
            <FormField label="GSTIN" hint="Required for B2B invoices">
              <input type="text" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="29AABCM1234F1ZP" className={inputClass} />
            </FormField>
          )}
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Add Customer</SubmitButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
