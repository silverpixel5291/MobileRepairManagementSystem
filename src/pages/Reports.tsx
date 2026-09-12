import { useState } from 'react';
import { TrendingUp, Package, Wrench, Store, Trash2, Download, Calendar, X } from 'lucide-react';
import { Store as StoreType } from '../store/useStore';

export function Reports({ store }: { store: StoreType }) {
  const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month' | 'all'>('month');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
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
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report.id)}
            className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy-900">{reports.find(r => r.id === selectedReport)?.title}</h2>
                <p className="text-sm text-navy-500">{dateFilter === 'day' ? 'Today' : dateFilter === 'week' ? 'This Week' : dateFilter === 'month' ? 'This Month' : 'All Time'}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={20} className="text-navy-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedReport === 'sales' && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-mint-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-mint-700">₹{totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-navy-600 mt-1">Total Revenue</p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-700">{filteredSales.length}</p>
                      <p className="text-sm text-navy-600 mt-1">Invoices</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-amber-700">₹{totalTax.toFixed(2)}</p>
                      <p className="text-sm text-navy-600 mt-1">GST Collected</p>
                    </div>
                    <div className="bg-navy-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-navy-700">₹{filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(0) : 0}</p>
                      <p className="text-sm text-navy-600 mt-1">Avg. Order</p>
                    </div>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Invoice</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Customer</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Amount</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Payment</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-50">
                        {filteredSales.map(sale => (
                          <tr key={sale.id}>
                            <td className="px-4 py-3 font-medium text-navy-800">{sale.invoiceNumber}</td>
                            <td className="px-4 py-3 text-navy-700">{sale.customerName}</td>
                            <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{sale.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-navy-600 capitalize">{sale.paymentMethod.replace('_', ' ')}</td>
                            <td className="px-4 py-3 text-right text-navy-500">{new Date(sale.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {selectedReport === 'inventory' && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-700">{store.inventory.length}</p>
                      <p className="text-sm text-navy-600 mt-1">Total Items</p>
                    </div>
                    <div className="bg-mint-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-mint-700">₹{(totalInventoryValue/1000).toFixed(0)}K</p>
                      <p className="text-sm text-navy-600 mt-1">Total Value</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-amber-700">{lowStockCount}</p>
                      <p className="text-sm text-navy-600 mt-1">Low Stock</p>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-rose-700">{store.inventory.filter(i => i.status === 'sold').length}</p>
                      <p className="text-sm text-navy-600 mt-1">Sold</p>
                    </div>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Item</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Category</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Qty</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Price</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-50">
                        {store.inventory.slice(0, 20).map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 font-medium text-navy-800">{item.name}</td>
                            <td className="px-4 py-3 text-navy-600 capitalize">{item.category.replace('_', ' ')}</td>
                            <td className="px-4 py-3 text-right text-navy-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{item.sellingPrice.toLocaleString()}</td>
                            <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded capitalize ${item.status === 'available' ? 'bg-mint-100 text-mint-700' : 'bg-navy-100 text-navy-600'}`}>{item.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {selectedReport === 'repairs' && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-amber-700">{store.repairs.length}</p>
                      <p className="text-sm text-navy-600 mt-1">Total Jobs</p>
                    </div>
                    <div className="bg-mint-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-mint-700">{store.repairs.filter(r => r.status === 'delivered').length}</p>
                      <p className="text-sm text-navy-600 mt-1">Completed</p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-700">{store.repairs.filter(r => r.status === 'working').length}</p>
                      <p className="text-sm text-navy-600 mt-1">In Progress</p>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-rose-700">₹{(totalEstimates/1000).toFixed(1)}K</p>
                      <p className="text-sm text-navy-600 mt-1">Total Estimates</p>
                    </div>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Repair #</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Customer</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Device</th>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Status</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Estimate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-50">
                        {store.repairs.map(repair => (
                          <tr key={repair.id}>
                            <td className="px-4 py-3 font-medium text-navy-800">{repair.repairNumber}</td>
                            <td className="px-4 py-3 text-navy-700">{repair.customerName}</td>
                            <td className="px-4 py-3 text-navy-600">{repair.deviceName}</td>
                            <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded capitalize bg-navy-100 text-navy-600">{repair.status.replace('_', ' ')}</span></td>
                            <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{repair.estimate?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {(selectedReport === 'suppliers' || selectedReport === 'scrap') && (
                <div className="text-center py-12">
                  <p className="text-navy-500">Detailed report view coming soon...</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-navy-100">
                <button 
                  onClick={() => {
                    const csv = 'Invoice,Customer,Amount,Date\n' + filteredSales.map(s => `${s.invoiceNumber},${s.customerName},${s.totalAmount},${s.createdAt}`).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedReport}-report-${dateFilter}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    store.showToast('Report exported successfully', 'success');
                  }}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                >
                  Export CSV
                </button>
                <button className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
