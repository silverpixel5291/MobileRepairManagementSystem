import {
  Package, Wrench, ShoppingCart, Store, AlertTriangle,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { inventoryItems, repairJobs, sales, notifications } from '../data/mockData';

export function Dashboard() {
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
  const openRepairs = repairJobs.filter(r => !['delivered', 'cannot_repair'].includes(r.status)).length;
  const todaySales = sales.filter(s => s.createdAt.startsWith('2026-09-06'));
  const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const lowStockItems = inventoryItems.filter(i => i.quantity <= i.minStock && i.minStock > 0);
  const supplierPayables = 155500;

  const stats = [
    { label: 'Inventory Value', value: `₹${(totalInventoryValue / 1000).toFixed(0)}K`, icon: Package, color: 'bg-primary-500', change: '+12%', up: true },
    { label: 'Open Repairs', value: openRepairs.toString(), icon: Wrench, color: 'bg-amber-500', change: '+2', up: true },
    { label: "Today's Sales", value: `₹${(todaySalesTotal / 1000).toFixed(1)}K`, icon: ShoppingCart, color: 'bg-mint-500', change: '+28%', up: true },
    { label: 'Supplier Payables', value: `₹${(supplierPayables / 1000).toFixed(0)}K`, icon: Store, color: 'bg-rose-500', change: '-5%', up: false },
  ];

  const recentRepairs = repairJobs.slice(0, 4);
  const recentSales = sales.slice(0, 3);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-navy-100 text-navy-700',
      diagnosing: 'bg-blue-100 text-blue-700',
      estimate_generated: 'bg-purple-100 text-purple-700',
      approved: 'bg-indigo-100 text-indigo-700',
      working: 'bg-amber-100 text-amber-700',
      waiting_parts: 'bg-orange-100 text-orange-700',
      quality_check: 'bg-teal-100 text-teal-700',
      ready_pickup: 'bg-mint-100 text-mint-700',
      delivered: 'bg-green-100 text-green-700',
      cannot_repair: 'bg-rose-100 text-rose-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 lg:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-sm text-navy-500 mt-1">Welcome back! Here's your shop overview.</p>
        </div>
        <div className="text-sm text-navy-500 bg-white px-4 py-2 rounded-lg border border-navy-100">
          <Clock size={14} className="inline mr-1.5" />
          Saturday, 6 Sep 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 lg:p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-mint-600' : 'text-rose-500'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="text-xs text-navy-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-semibold text-amber-800">Low Stock Alerts</h3>
          </div>
          <div className="space-y-1">
            {lowStockItems.map(item => (
              <p key={item.id} className="text-sm text-amber-700">
                <span className="font-medium">{item.name}</span> — {item.quantity} remaining (min: {item.minStock})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Repair Jobs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-navy-100">
            <h2 className="font-semibold text-navy-900">Recent Repair Jobs</h2>
            <span className="text-xs text-navy-500 bg-navy-50 px-2 py-1 rounded">{openRepairs} open</span>
          </div>
          <div className="divide-y divide-navy-50">
            {recentRepairs.map(job => (
              <div key={job.id} className="p-4 hover:bg-navy-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-navy-900">{job.repairNumber}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-navy-600 mt-1 truncate">{job.customerName} • {job.deviceName}</p>
                    <p className="text-xs text-navy-400 mt-0.5 truncate">{job.problem}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {job.estimate && <p className="text-sm font-medium text-navy-700">₹{job.estimate.toLocaleString()}</p>}
                    {job.assignedToName && <p className="text-xs text-navy-400">{job.assignedToName}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-navy-100">
            <h2 className="font-semibold text-navy-900">Notifications</h2>
            <span className="text-xs text-white bg-rose-500 px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <div className="divide-y divide-navy-50 max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-3 ${!notif.read ? 'bg-primary-50/30' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    notif.type === 'warning' ? 'bg-amber-400' :
                    notif.type === 'success' ? 'bg-mint-400' :
                    notif.type === 'error' ? 'bg-rose-400' : 'bg-primary-400'
                  } ${!notif.read ? 'animate-pulse-dot' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800">{notif.title}</p>
                    <p className="text-xs text-navy-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-navy-100">
          <h2 className="font-semibold text-navy-900">Recent Sales</h2>
          <TrendingUp size={18} className="text-mint-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Items</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {recentSales.map(sale => (
                <tr key={sale.id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-3 font-medium text-navy-800">{sale.invoiceNumber}</td>
                  <td className="px-4 py-3 text-navy-600">{sale.customerName}</td>
                  <td className="px-4 py-3 text-navy-500 hidden sm:table-cell">{sale.items.length} item(s)</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded capitalize">{sale.paymentMethod.replace('_', ' ')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
