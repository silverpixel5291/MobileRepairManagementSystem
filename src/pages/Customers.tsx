import { useState } from 'react';
import { Plus, Search, Users, Phone, Mail, Building } from 'lucide-react';
import { customers } from '../data/mockData';

export function Customers() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Customers</h1>
          <p className="text-sm text-navy-500">{customers.length} customers</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
            <Search size={16} className="text-navy-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>

      {/* Customer Grid */}
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
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${customer.type === 'business' ? 'bg-purple-50 text-purple-600' : 'bg-navy-50 text-navy-500'}`}>
                    {customer.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Phone size={14} className="text-navy-400" />
                {customer.phone}
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-navy-600">
                  <Mail size={14} className="text-navy-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-navy-50 text-xs text-navy-500">
              <span>{customer.totalPurchases} purchases</span>
              <span>{customer.totalRepairs} repairs</span>
              <span className="ml-auto text-navy-400">Since {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>

            {customer.gstin && (
              <div className="mt-2 text-xs bg-navy-50 rounded px-2 py-1 text-navy-500">
                GSTIN: {customer.gstin}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No customers found.</p>
        </div>
      )}
    </div>
  );
}
