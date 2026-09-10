import { useState } from 'react';
import { Plus, Search, Store, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';
import { suppliers } from '../data/mockData';

export function Suppliers() {
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayable = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Suppliers</h1>
          <p className="text-sm text-navy-500">{suppliers.length} suppliers • ₹{totalPayable.toLocaleString()} total payable</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-navy-400" />
          <input
            type="text"
            placeholder="Search by name, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
          />
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow">
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
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Phone size={14} className="text-navy-400" />
                {supplier.phone}
              </div>
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm text-navy-600">
                  <Mail size={14} className="text-navy-400" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <MapPin size={14} className="text-navy-400" />
                {supplier.city}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-navy-50">
              <div className="flex items-center gap-1 text-xs text-navy-500">
                <IndianRupee size={12} />
                {supplier.totalOrders} orders
              </div>
              {supplier.gstin && (
                <span className="text-xs bg-navy-50 text-navy-500 px-2 py-0.5 rounded">GSTIN: {supplier.gstin}</span>
              )}
              <button
                onClick={() => setSelectedSupplier(supplier.id)}
                className="ml-auto text-xs text-primary-600 font-medium hover:text-primary-700"
              >
                View Ledger →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Store size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No suppliers found.</p>
        </div>
      )}
    </div>
  );
}
