import { TrendingUp, Package, Wrench, Store, Trash2, Download, Calendar } from 'lucide-react';

export function Reports() {
  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Invoices, gross sales, discounts, GST, payment methods, returns',
      icon: TrendingUp,
      color: 'bg-mint-500',
      metrics: ['₹15,101 Revenue', '3 Invoices', '₹1,339 GST']
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Quantity, value, category, status, location, low stock items',
      icon: Package,
      color: 'bg-primary-500',
      metrics: ['10 Items', '₹1.6L Value', '2 Low Stock']
    },
    {
      id: 'repairs',
      title: 'Repair Report',
      description: 'Jobs by status, technician, priority, turnaround time, revenue',
      icon: Wrench,
      color: 'bg-amber-500',
      metrics: ['5 Jobs', '2 Completed', '₹13,500 Est.']
    },
    {
      id: 'suppliers',
      title: 'Supplier Report',
      description: 'Purchases, payments, outstanding balances, order status',
      icon: Store,
      color: 'bg-purple-500',
      metrics: ['4 Suppliers', '₹1.55L Payable', '72 Orders']
    },
    {
      id: 'scrap',
      title: 'Scrap Report',
      description: 'Scrap quantity, reason, category, recovery value',
      icon: Trash2,
      color: 'bg-rose-500',
      metrics: ['3 Records', '18 Qty', '₹600 Recovery']
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
          <p className="text-sm text-navy-500">Business analytics and operational insights</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
            <Calendar size={16} />
            Sep 2026
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-lg ${report.color} flex items-center justify-center`}>
                <report.icon size={22} className="text-white" />
              </div>
              <Download size={16} className="text-navy-300 group-hover:text-primary-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-navy-900 mb-1">{report.title}</h3>
            <p className="text-xs text-navy-500 mb-3">{report.description}</p>
            <div className="flex flex-wrap gap-2">
              {report.metrics.map((metric, idx) => (
                <span key={idx} className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-4">Monthly Summary — September 2026</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-navy-50 rounded-lg">
            <p className="text-2xl font-bold text-navy-900">₹15.1K</p>
            <p className="text-xs text-navy-500 mt-1">Total Sales</p>
          </div>
          <div className="text-center p-4 bg-navy-50 rounded-lg">
            <p className="text-2xl font-bold text-navy-900">5</p>
            <p className="text-xs text-navy-500 mt-1">Repair Jobs</p>
          </div>
          <div className="text-center p-4 bg-navy-50 rounded-lg">
            <p className="text-2xl font-bold text-navy-900">6</p>
            <p className="text-xs text-navy-500 mt-1">New Customers</p>
          </div>
          <div className="text-center p-4 bg-navy-50 rounded-lg">
            <p className="text-2xl font-bold text-mint-600">₹600</p>
            <p className="text-xs text-navy-500 mt-1">Scrap Recovery</p>
          </div>
        </div>
      </div>

      {/* Sales Trend Placeholder */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-4">Sales Trend</h2>
        <div className="h-48 flex items-end justify-between gap-2 px-4">
          {[35, 52, 45, 68, 42, 75, 60].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary-400 rounded-t-sm hover:bg-primary-500 transition-colors"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-navy-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
