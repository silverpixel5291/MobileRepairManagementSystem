import { useState } from 'react';
import { Search, Plus, QrCode, MoreVertical, Package, Smartphone, Cable, Cpu } from 'lucide-react';
import { inventoryItems, InventoryItem } from '../data/mockData';

export function Inventory() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filtered = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      (item.imei && item.imei.includes(search));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'mobile': return <Smartphone size={16} />;
      case 'accessory': return <Cable size={16} />;
      case 'spare_part': return <Cpu size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: 'bg-mint-100 text-mint-700',
      sold: 'bg-navy-100 text-navy-600',
      in_repair: 'bg-amber-100 text-amber-700',
      scrapped: 'bg-rose-100 text-rose-700',
      reserved: 'bg-purple-100 text-purple-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mobile', label: 'Mobiles' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'spare_part', label: 'Spare Parts' },
    { value: 'other', label: 'Other' },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'in_repair', label: 'In Repair' },
    { value: 'scrapped', label: 'Scrapped' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Inventory</h1>
          <p className="text-sm text-navy-500">{inventoryItems.length} items tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
            <QrCode size={16} />
            Scan
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
            <Search size={16} className="text-navy-400" />
            <input
              type="text"
              placeholder="Search by name, brand, device ID, IMEI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none"
          >
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none"
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Item Detail Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedItem(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy-900">Item Details</h2>
                <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-navy-100 rounded text-navy-500">✕</button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-navy-50 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 bg-navy-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    {getCategoryIcon(selectedItem.category)}
                  </div>
                  <h3 className="font-semibold text-navy-900">{selectedItem.name}</h3>
                  <p className="text-xs text-navy-500">{selectedItem.deviceId}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Category</p>
                    <p className="text-sm font-medium text-navy-800 capitalize">{selectedItem.category.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Status</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(selectedItem.status)}`}>
                      {selectedItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Cost Price</p>
                    <p className="text-sm font-semibold text-navy-800">₹{selectedItem.costPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Selling Price</p>
                    <p className="text-sm font-semibold text-mint-600">₹{selectedItem.sellingPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Quantity</p>
                    <p className="text-sm font-medium text-navy-800">{selectedItem.quantity}</p>
                  </div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Location</p>
                    <p className="text-sm font-medium text-navy-800">{selectedItem.rack} / {selectedItem.box}</p>
                  </div>
                </div>

                {selectedItem.imei && (
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">IMEI</p>
                    <p className="text-sm font-mono text-navy-800">{selectedItem.imei}</p>
                  </div>
                )}

                {selectedItem.model && (
                  <div className="bg-white border border-navy-100 rounded-lg p-3">
                    <p className="text-xs text-navy-500">Model / Specs</p>
                    <p className="text-sm text-navy-800">
                      {selectedItem.model}
                      {selectedItem.ram && ` • ${selectedItem.ram} RAM`}
                      {selectedItem.rom && ` • ${selectedItem.rom}`}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-navy-100">
                  <p className="text-xs font-medium text-navy-500 mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100">Sell</button>
                    <button className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100">Send to Repair</button>
                    <button className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Transfer</button>
                    <button className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Print QR</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Location</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Cost</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Price</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-navy-500 uppercase">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-navy-50/50 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-navy-100 flex items-center justify-center text-navy-500">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <p className="font-medium text-navy-800">{item.name}</p>
                        <p className="text-xs text-navy-400">{item.deviceId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy-600 capitalize">{item.category.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-navy-600">{item.rack}/{item.box}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${item.quantity <= item.minStock && item.minStock > 0 ? 'text-rose-600' : 'text-navy-800'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-navy-600">₹{item.costPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-800">₹{item.sellingPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 hover:bg-navy-100 rounded">
                      <MoreVertical size={16} className="text-navy-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Cards (Mobile) */}
      <div className="md:hidden space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm active:bg-navy-50"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center text-navy-500">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <p className="font-medium text-navy-800">{item.name}</p>
                  <p className="text-xs text-navy-400">{item.brand} {item.model && `• ${item.model}`}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-50">
              <div className="flex items-center gap-4 text-xs text-navy-500">
                <span>📍 {item.rack}/{item.box}</span>
                <span>Qty: {item.quantity}</span>
              </div>
              <p className="font-semibold text-navy-800">₹{item.sellingPrice.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-navy-200 mb-3" />
          <p className="text-navy-500">No items found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
