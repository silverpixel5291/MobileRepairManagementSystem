import { useState } from 'react';
import { Search, Plus, QrCode, MoreVertical, Package, Smartphone, Cable, Cpu } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, SubmitButton, Toggle } from '../components/Modal';
import { QRCodeDisplay, ScanModal } from '../components/GlobalActions';
import { Store } from '../store/useStore';
import { InventoryItem, ItemCategory, InventoryStatus } from '../data/mockData';

export function Inventory({ store }: { store: Store }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showQR, setShowQR] = useState<InventoryItem | null>(null);
  const [showScan, setShowScan] = useState(false);
  const [nullImei, setNullImei] = useState(false);
  const [form, setForm] = useState({
    name: '', category: 'mobile' as ItemCategory, brand: '', model: '', imei: '',
    ram: '', rom: '', condition: '', costPrice: 0, sellingPrice: 0, minSellingPrice: 0,
    quantity: 1, minStock: 0, status: 'available' as InventoryStatus,
    rack: '', box: '', photos: [] as string[],
  });

  const filtered = store.inventory.filter(item => {
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
      available: 'bg-mint-100 text-mint-700', sold: 'bg-navy-100 text-navy-600',
      in_repair: 'bg-amber-100 text-amber-700', scrapped: 'bg-rose-100 text-rose-700',
      reserved: 'bg-purple-100 text-purple-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleSubmit = () => {
    if (!form.name || !form.brand || form.sellingPrice <= 0) return;
    if (form.category === 'mobile' && !nullImei && !form.imei) return;
    store.addInventory({ ...form, supplierId: undefined, sellerId: undefined });
    setForm({ name: '', category: 'mobile', brand: '', model: '', imei: '', ram: '', rom: '', condition: '', costPrice: 0, sellingPrice: 0, minSellingPrice: 0, quantity: 1, minStock: 0, status: 'available', rack: '', box: '', photos: [] });
    setNullImei(false);
    setShowAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Inventory</h1>
          <p className="text-sm text-navy-500">{store.inventory.length} items tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowScan(true)} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
            <QrCode size={16} /> Scan
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
            <Search size={16} className="text-navy-400" />
            <input type="text" placeholder="Search by name, brand, device ID, IMEI..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none">
            <option value="all">All Categories</option>
            <option value="mobile">Mobiles</option>
            <option value="accessory">Accessories</option>
            <option value="spare_part">Spare Parts</option>
            <option value="other">Other</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm text-navy-700 outline-none">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="in_repair">In Repair</option>
            <option value="scrapped">Scrapped</option>
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
                  <div className="w-16 h-16 bg-navy-200 rounded-lg mx-auto mb-2 flex items-center justify-center">{getCategoryIcon(selectedItem.category)}</div>
                  <h3 className="font-semibold text-navy-900">{selectedItem.name}</h3>
                  <p className="text-xs text-navy-500">{selectedItem.deviceId}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Category</p><p className="text-sm font-medium text-navy-800 capitalize">{selectedItem.category.replace('_', ' ')}</p></div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Status</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(selectedItem.status)}`}>{selectedItem.status.replace('_', ' ')}</span></div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Cost Price</p><p className="text-sm font-semibold text-navy-800">₹{selectedItem.costPrice.toLocaleString()}</p></div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Selling Price</p><p className="text-sm font-semibold text-mint-600">₹{selectedItem.sellingPrice.toLocaleString()}</p></div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Quantity</p><p className="text-sm font-medium text-navy-800">{selectedItem.quantity}</p></div>
                  <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">Location</p><p className="text-sm font-medium text-navy-800">{selectedItem.rack} / {selectedItem.box}</p></div>
                </div>
                {selectedItem.imei && <div className="bg-white border border-navy-100 rounded-lg p-3"><p className="text-xs text-navy-500">IMEI</p><p className="text-sm font-mono text-navy-800">{selectedItem.imei}</p></div>}
                <div className="pt-3 border-t border-navy-100">
                  <p className="text-xs font-medium text-navy-500 mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100">Sell</button>
                    <button className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100">Send to Repair</button>
                    <button className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Transfer</button>
                    <button onClick={() => setShowQR(selectedItem)} className="px-3 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100 flex items-center justify-center gap-1"><QrCode size={14} /> Print QR</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-navy-50/50 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-navy-100 flex items-center justify-center text-navy-500">{getCategoryIcon(item.category)}</div>
                      <div><p className="font-medium text-navy-800">{item.name}</p><p className="text-xs text-navy-400">{item.deviceId}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy-600 capitalize">{item.category.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-navy-600">{item.rack}/{item.box}</td>
                  <td className="px-4 py-3 text-right"><span className={`font-medium ${item.quantity <= item.minStock && item.minStock > 0 ? 'text-rose-600' : 'text-navy-800'}`}>{item.quantity}</span></td>
                  <td className="px-4 py-3 text-right text-navy-600">₹{item.costPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-800">₹{item.sellingPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>{item.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm active:bg-navy-50" onClick={() => setSelectedItem(item)}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center text-navy-500">{getCategoryIcon(item.category)}</div>
                <div><p className="font-medium text-navy-800">{item.name}</p><p className="text-xs text-navy-400">{item.brand} {item.model && `• ${item.model}`}</p></div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>{item.status.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-50">
              <div className="flex items-center gap-4 text-xs text-navy-500">
                <span>📍 {item.rack}/{item.box}</span><span>Qty: {item.quantity}</span>
              </div>
              <p className="font-semibold text-navy-800">₹{item.sellingPrice.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><Package size={48} className="mx-auto text-navy-200 mb-3" /><p className="text-navy-500">No items found matching your filters.</p></div>
      )}

      {/* QR Code Display Modal */}
      {showQR && (
        <QRCodeDisplay
          deviceId={showQR.deviceId}
          qrToken={showQR.qrToken}
          itemName={showQR.name}
          location={showQR.rack && showQR.box ? `${showQR.rack} / ${showQR.box}` : undefined}
          onClose={() => setShowQR(null)}
        />
      )}

      {/* Scan Modal */}
      <ScanModal
        open={showScan}
        onClose={() => setShowScan(false)}
        onScan={(token) => {
          const item = store.inventory.find(i => i.deviceId === token || i.qrToken === token);
          if (item) {
            setSelectedItem(item);
            setShowScan(false);
          } else {
            store.showToast(`No item found for "${token}"`, 'error');
          }
        }}
      />

      {/* Add Item Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory Item" subtitle="Enter item details to add to inventory" size="lg">
        <div className="space-y-4">
          <FormRow>
            <FormField label="Item Name" required>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Samsung Galaxy S24" className={inputClass} />
            </FormField>
            <FormField label="Category" required>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ItemCategory })} className={selectClass}>
                <option value="mobile">Mobile Phone</option>
                <option value="accessory">Accessory</option>
                <option value="spare_part">Spare Part</option>
                <option value="other">Other</option>
              </select>
            </FormField>
          </FormRow>

          <FormRow cols={3}>
            <FormField label="Brand" required>
              <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" className={inputClass} />
            </FormField>
            <FormField label="Model">
              <input type="text" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Model name" className={inputClass} />
            </FormField>
            <FormField label="Condition">
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className={selectClass}>
                <option value="">Select</option>
                <option value="Like New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </FormField>
          </FormRow>

          {form.category === 'mobile' && (
            <>
              <div className="flex items-center justify-between bg-navy-50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-navy-700">Null IMEI</p>
                  <p className="text-xs text-navy-500">Enable if device has no valid IMEI</p>
                </div>
                <Toggle checked={nullImei} onChange={setNullImei} />
              </div>
              {!nullImei && (
                <FormField label="IMEI" required hint="15-digit unique identifier">
                  <input type="text" value={form.imei} onChange={e => setForm({ ...form, imei: e.target.value })} placeholder="353456789012345" maxLength={15} className={inputClass} />
                </FormField>
              )}
              <FormRow>
                <FormField label="RAM"><input type="text" value={form.ram} onChange={e => setForm({ ...form, ram: e.target.value })} placeholder="e.g. 8GB" className={inputClass} /></FormField>
                <FormField label="ROM / Storage"><input type="text" value={form.rom} onChange={e => setForm({ ...form, rom: e.target.value })} placeholder="e.g. 128GB" className={inputClass} /></FormField>
              </FormRow>
            </>
          )}

          <FormRow cols={3}>
            <FormField label="Cost Price (₹)" required>
              <input type="number" value={form.costPrice || ''} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
            <FormField label="Selling Price (₹)" required>
              <input type="number" value={form.sellingPrice || ''} onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
            <FormField label="Min Selling Price (₹)">
              <input type="number" value={form.minSellingPrice || ''} onChange={e => setForm({ ...form, minSellingPrice: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
          </FormRow>

          <FormRow cols={3}>
            <FormField label="Quantity" required>
              <input type="number" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="1" min="1" className={inputClass} />
            </FormField>
            <FormField label="Min Stock Alert">
              <input type="number" value={form.minStock || ''} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as InventoryStatus })} className={selectClass}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
              </select>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Rack"><input type="text" value={form.rack} onChange={e => setForm({ ...form, rack: e.target.value })} placeholder="e.g. R-01" className={inputClass} /></FormField>
            <FormField label="Box"><input type="text" value={form.box} onChange={e => setForm({ ...form, box: e.target.value })} placeholder="e.g. B-03" className={inputClass} /></FormField>
          </FormRow>

          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Add to Inventory</SubmitButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
