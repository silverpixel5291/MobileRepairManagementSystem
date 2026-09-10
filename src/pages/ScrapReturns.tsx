import { Trash2, RotateCcw, Package, IndianRupee } from 'lucide-react';
import { scrapRecords } from '../data/mockData';

export function ScrapReturns() {
  const totalRecovery = scrapRecords.reduce((sum, s) => sum + s.recoveryValue, 0);
  const totalScrapQty = scrapRecords.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Scrap & Returns</h1>
          <p className="text-sm text-navy-500">Manage scrapped items and sales returns</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
            <RotateCcw size={16} />
            New Return
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
            <Trash2 size={16} />
            Record Scrap
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
              <Trash2 size={14} className="text-rose-600" />
            </div>
            <span className="text-xs text-navy-500">Scrap Records</span>
          </div>
          <p className="text-2xl font-bold text-navy-900">{scrapRecords.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-navy-100 flex items-center justify-center">
              <Package size={14} className="text-navy-600" />
            </div>
            <span className="text-xs text-navy-500">Total Qty Scrapped</span>
          </div>
          <p className="text-2xl font-bold text-navy-900">{totalScrapQty}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-mint-100 flex items-center justify-center">
              <IndianRupee size={14} className="text-mint-600" />
            </div>
            <span className="text-xs text-navy-500">Recovery Value</span>
          </div>
          <p className="text-2xl font-bold text-mint-600">₹{totalRecovery.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <RotateCcw size={14} className="text-amber-600" />
            </div>
            <span className="text-xs text-navy-500">Returns</span>
          </div>
          <p className="text-2xl font-bold text-navy-900">0</p>
        </div>
      </div>

      {/* Scrap Register */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-navy-100">
          <h2 className="font-semibold text-navy-900">Scrap Register</h2>
          <span className="text-xs text-navy-500 bg-navy-50 px-2 py-1 rounded">{scrapRecords.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden md:table-cell">Reason</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Recovery</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {scrapRecords.map(record => (
                <tr key={record.id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-800">{record.itemName}</p>
                  </td>
                  <td className="px-4 py-3 text-navy-600 capitalize hidden sm:table-cell">{record.category.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-800">{record.quantity}</td>
                  <td className="px-4 py-3 text-navy-500 hidden md:table-cell max-w-xs truncate">{record.reason}</td>
                  <td className="px-4 py-3 text-right font-medium text-mint-600">₹{record.recoveryValue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-navy-500 hidden lg:table-cell">{new Date(record.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Returns Section */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-8 text-center">
        <RotateCcw size={48} className="mx-auto text-navy-200 mb-3" />
        <h3 className="font-semibold text-navy-700 mb-1">No Returns Recorded</h3>
        <p className="text-sm text-navy-500">Returns linked to original sales will appear here.</p>
      </div>
    </div>
  );
}
