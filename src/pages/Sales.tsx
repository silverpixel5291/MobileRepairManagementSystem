import { useState } from 'react';
import { Plus, Download, FileText, Search, ShoppingCart } from 'lucide-react';
import { sales } from '../data/mockData';

export function Sales() {
  const [search, setSearch] = useState('');

  const filtered = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTax = sales.reduce((sum, s) => sum + s.cgst + s.sgst + s.igst, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Sales</h1>
          <p className="text-sm text-navy-500">{sales.length} invoices • ₹{totalRevenue.toLocaleString()} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
            <Plus size={16} />
            New Sale
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <p className="text-xs text-navy-500">Total Revenue</p>
          <p className="text-xl font-bold text-navy-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <p className="text-xs text-navy-500">GST Collected</p>
          <p className="text-xl font-bold text-navy-900 mt-1">₹{totalTax.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <p className="text-xs text-navy-500">Invoices</p>
          <p className="text-xl font-bold text-navy-900 mt-1">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <p className="text-xs text-navy-500">Avg. Order Value</p>
          <p className="text-xl font-bold text-navy-900 mt-1">₹{Math.round(totalRevenue / sales.length).toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-navy-400" />
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden md:table-cell">Items</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Tax</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Payment</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map(sale => (
                <tr key={sale.id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-primary-500" />
                      <span className="font-medium text-navy-800">{sale.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy-700">{sale.customerName}</td>
                  <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{sale.items.length} item(s)</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-navy-500 hidden sm:table-cell">₹{(sale.cgst + sale.sgst + sale.igst).toFixed(0)}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded capitalize">{sale.paymentMethod.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-navy-500 hidden lg:table-cell">{new Date(sale.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary-600 font-medium hover:text-primary-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No sales found.</p>
        </div>
      )}
    </div>
  );
}
