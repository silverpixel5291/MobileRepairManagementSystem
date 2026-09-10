import { useState } from 'react';
import { TrendingUp, Package, Wrench, Store, Trash2, Download, Calendar } from 'lucide-react';
import { Store as StoreType } from '../store/useStore';

export function Reports({ store }: { store: StoreType }) {
  const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month' | 'all'>('month');
  // Filter data by date range
  const now = new Date('2026-09-06');
  const filteredSales = store.sales.filter(s => {
    const date = new Date(s.createdAt);
    if (dateFilter === 'day') return date.toDateString() === now.toDateString();
    if (dateFilter === 'week') {
      const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }
    if (dateFilter === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTax = filteredSales.reduce((sum, s) => sum + s.cgst + s.sgst + s.igst, 0);
  const totalInventoryValue = store.inventory.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const lowStockCount = store.inventory.filter(i => i.quantity <= i.minStock && i.minStock > 0).length;
  const totalRecovery = store.scrap.reduce((sum, s) => sum + s.recoveryValue, 0);
  const totalScrapQty = store.scrap.reduce((sum, s) => sum + s.quantity, 0);
  const totalEstimates = store.repairs.reduce((sum, r) => sum + (r.estimate || 0), 0);

  const reports = [
    { id: 'sales', title: 'Sales Report', description: 'Invoices, gross sales, discounts, GST, payment methods, returns', icon: TrendingUp, color: 'bg-mint-500', metrics: [`₹${(totalRevenue/1000).toFixed(1)}K Revenue`, `${filteredSales.length} Invoices`, `₹${(totalTax/1000).toFixed(1)}K GST`] },
    { id: 'inventory', title: 'Inventory Report', description: 'Quantity, value, category, status, location, low stock items', icon: Package, color: 'bg-primary-500', metrics: [`${store.inventory.length} Items`, `₹${(totalInventoryValue/1000).toFixed(0)}K Value`, `${lowStockCount} Low Stock`] },
    { id: 'repairs', title: 'Repair Report', description: 'Jobs by status, technician, priority, turnaround time, revenue', icon: Wrench, color: 'bg-amber-500', metrics: [`${store.repairs.length} Jobs`, `${store.repairs.filter(r => r.status === 'delivered').length} Completed`, `₹${(totalEstimates/1000).toFixed(1)}K Est.`] },
    { id: 'suppliers', title: 'Supplier Report', description: 'Purchases, payments, outstanding balances, order status', icon: Store, color: 'bg-purple-500', metrics: [`${store.suppliers.length} Suppliers`, `₹${(store.suppliers.reduce((s, x) => s + x.currentBalance, 0)/1000).toFixed(0)}K Payable`, `${store.suppliers.reduce((s, x) => s + x.totalOrders, 0)} Orders`] },
    { id: 'scrap', title: 'Scrap Report', description: 'Scrap quantity, reason, category, recovery value', icon: Trash2, color: 'bg-rose-500', metrics: [`${store.scrap.length} Records`, `${totalScrapQty} Qty`, `₹${totalRecovery} Recovery`] },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
          <p className="text-sm text-navy-500">Business analytics and operational insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-navy-200 rounded-lg p-1">
            {(['day', 'week', 'month', 'all'] as const).map(period => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  dateFilter === period ? 'bg-primary-500 text-white' : 'text-navy-600 hover:bg-navy-50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              const csv = 'Invoice,Customer,Amount,Date\n' + filteredSales.map(s => `${s.invoiceNumber},${s.customerName},${s.totalAmount},${s.createdAt}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sales-report-${dateFilter}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              store.showToast('Report exported successfully', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm"
          >
            <Download size={16} />Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-lg ${report.color} flex items-center justify-center`}><report.icon size={22} className="text-white" /></div>
              <Download size={16} className="text-navy-300 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-navy-900 mb-1">{report.title}</h3>
            <p className="text-xs text-navy-500 mb-3">{report.description}</p>
            <div className="flex flex-wrap gap-2">{report.metrics.map((metric, idx) => (<span key={idx} className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded">{metric}</span>))}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-4">
          Summary — {dateFilter === 'day' ? 'Today' : dateFilter === 'week' ? 'This Week' : dateFilter === 'month' ? 'This Month' : 'All Time'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-navy-900">₹{(totalRevenue/1000).toFixed(1)}K</p><p className="text-xs text-navy-500 mt-1">Total Sales</p></div>
          <div className="text-center p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-navy-900">{filteredSales.length}</p><p className="text-xs text-navy-500 mt-1">Invoices</p></div>
          <div className="text-center p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-navy-900">{store.customers.length}</p><p className="text-xs text-navy-500 mt-1">Customers</p></div>
          <div className="text-center p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-mint-600">₹{totalRecovery}</p><p className="text-xs text-navy-500 mt-1">Scrap Recovery</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-4">Sales Trend</h2>
        <div className="h-48 flex items-end justify-between gap-2 px-4">
          {[35, 52, 45, 68, 42, 75, 60].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary-400 rounded-t-sm hover:bg-primary-500 transition-colors" style={{ height: `${height}%` }} />
              <span className="text-[10px] text-navy-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
