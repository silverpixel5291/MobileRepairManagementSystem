import { useState } from 'react';
import { Plus, Search, Store, Phone, Mail, MapPin, IndianRupee, X, Calendar, Package, AlertTriangle, Download, Edit, MessageCircle } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, textareaClass, SubmitButton } from '../components/Modal';
import { Store as StoreType } from '../store/useStore';
import { Supplier, PurchaseOrder } from '../data/mockData';

export function Suppliers({ store }: { store: StoreType }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReorder, setShowReorder] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [historyDateFilter, setHistoryDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [reorderQuantity, setReorderQuantity] = useState(1);
  const [reorderNotes, setReorderNotes] = useState('');
  
  const [form, setForm] = useState({
    code: '', name: '', contactPerson: '', phone: '', email: '', city: '', address: '', gstin: '',
    openingBalance: 0, currentBalance: 0, totalOrders: 0, products: [] as string[],
  });

  const filtered = store.suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayable = store.suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.code) return;
    store.addSupplier(form);
    setForm({ code: '', name: '', contactPerson: '', phone: '', email: '', city: '', address: '', gstin: '', openingBalance: 0, currentBalance: 0, totalOrders: 0, products: [] });
    setShowAdd(false);
  };

  const handleEdit = () => {
    if (!selectedSupplier || !form.name || !form.phone) return;
    store.updateSupplier(selectedSupplier.id, form);
    setSelectedSupplier({ ...selectedSupplier, ...form });
    setShowEdit(false);
  };

  const openEditModal = () => {
    if (!selectedSupplier) return;
    setForm({
      code: selectedSupplier.code,
      name: selectedSupplier.name,
      contactPerson: selectedSupplier.contactPerson || '',
      phone: selectedSupplier.phone,
      email: selectedSupplier.email || '',
      city: selectedSupplier.city,
      address: selectedSupplier.address || '',
      gstin: selectedSupplier.gstin || '',
      openingBalance: selectedSupplier.openingBalance,
      currentBalance: selectedSupplier.currentBalance,
      totalOrders: selectedSupplier.totalOrders,
      products: selectedSupplier.products || [],
    });
    setShowEdit(true);
  };

  const getSupplierOrders = (supplierId: string) => {
    const orders = store.purchaseOrders.filter(o => o.supplierId === supplierId);
    
    if (historyDateFilter === 'today') {
      const today = new Date().toDateString();
      return orders.filter(o => new Date(o.purchaseDate).toDateString() === today);
    } else if (historyDateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orders.filter(o => new Date(o.purchaseDate) >= weekAgo);
    } else if (historyDateFilter === 'month') {
      const now = new Date();
      return orders.filter(o => {
        const orderDate = new Date(o.purchaseDate);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      });
    }
    return orders;
  };

  const getStockStatus = (currentStock: number) => {
    if (currentStock === 0) return { label: 'Out of Stock', color: 'bg-rose-100 text-rose-700', icon: '🔴' };
    if (currentStock < 5) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', icon: '🟡' };
    return { label: 'In Stock', color: 'bg-mint-100 text-mint-700', icon: '🟢' };
  };

  const handleExportHistory = () => {
    if (!selectedSupplier) return;
    
    const orders = getSupplierOrders(selectedSupplier.id);
    const headers = ['Item Name', 'Quantity', 'Purchase Price', 'Total Amount', 'Purchase Date', 'Invoice Ref', 'Current Stock', 'Status'];
    const csvData = orders.map(order => [
      order.itemName,
      order.quantity,
      order.purchasePrice,
      order.totalAmount,
      new Date(order.purchaseDate).toLocaleDateString('en-IN'),
      order.invoiceRef || '',
      order.currentStock,
      order.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedSupplier.name}_purchases_${historyDateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.showToast('Purchase history exported successfully', 'success');
  };

  const handleReorder = () => {
    if (!selectedSupplier || !selectedOrder || reorderQuantity <= 0) return;
    
    // Create new purchase order
    const newOrder = {
      supplierId: selectedSupplier.id,
      itemName: selectedOrder.itemName,
      quantity: reorderQuantity,
      purchasePrice: selectedOrder.purchasePrice,
      totalAmount: reorderQuantity * selectedOrder.purchasePrice,
      purchaseDate: new Date().toISOString().split('T')[0],
      invoiceRef: `REORDER-${Date.now()}`,
      currentStock: 0,
      status: 'pending' as const,
    };
    
    store.addPurchaseOrder(newOrder);
    
    // Generate WhatsApp message
    const message = `Hi ${selectedSupplier.contactPerson || selectedSupplier.name},\n\nWe would like to reorder:\n\nItem: ${selectedOrder.itemName}\nQuantity: ${reorderQuantity}\nExpected Price: ₹${selectedOrder.purchasePrice} per unit\nTotal: ₹${newOrder.totalAmount.toLocaleString()}\n\n${reorderNotes ? `Notes: ${reorderNotes}\n\n` : ''}Please confirm availability and delivery timeline.\n\nThank you!`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${selectedSupplier.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setShowReorder(false);
    setReorderQuantity(1);
    setReorderNotes('');
    store.showToast('Reorder request sent via WhatsApp', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Suppliers</h1>
          <p className="text-sm text-navy-500">{store.suppliers.length} suppliers • ₹{totalPayable.toLocaleString()} total payable</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-navy-400" />
          <input type="text" placeholder="Search by name, code, or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(supplier => {
          const supplierOrders = store.purchaseOrders.filter(o => o.supplierId === supplier.id);
          const lowStockItems = supplierOrders.filter(o => o.currentStock < 5 && o.status === 'received');
          
          return (
            <div 
              key={supplier.id} 
              onClick={() => setSelectedSupplier(supplier)}
              className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Store size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{supplier.name}</p>
                    <p className="text-xs text-navy-400">{supplier.code}</p>
                    {supplier.contactPerson && <p className="text-xs text-navy-500 mt-0.5">Contact: {supplier.contactPerson}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-navy-900">₹{supplier.currentBalance.toLocaleString()}</p>
                  <p className="text-xs text-navy-500">Payable</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-navy-600"><Phone size={14} className="text-navy-400" />{supplier.phone}</div>
                {supplier.email && <div className="flex items-center gap-2 text-sm text-navy-600"><Mail size={14} className="text-navy-400" /><span className="truncate">{supplier.email}</span></div>}
                <div className="flex items-center gap-2 text-sm text-navy-600"><MapPin size={14} className="text-navy-400" />{supplier.city}</div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-navy-50">
                <div className="flex items-center gap-1 text-xs text-navy-500"><IndianRupee size={12} />{supplier.totalOrders} orders</div>
                {lowStockItems.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertTriangle size={12} />
                    {lowStockItems.length} low stock
                  </div>
                )}
                {supplier.gstin && <span className="text-xs bg-navy-50 text-navy-500 px-2 py-0.5 rounded">GSTIN: {supplier.gstin}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><Store size={48} className="mx-auto text-navy-200 mb-3" /><p className="text-navy-500">No suppliers found.</p></div>
      )}

      {/* Add Supplier Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Supplier" subtitle="Create a new supplier record">
        <div className="space-y-4">
          <FormRow>
            <FormField label="Supplier Code" required>
              <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SUP-005" className={inputClass} />
            </FormField>
            <FormField label="Supplier Name" required>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Company name" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Contact Person">
              <input type="text" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Contact person name" className={inputClass} />
            </FormField>
            <FormField label="Phone" required>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@supplier.com" className={inputClass} />
            </FormField>
            <FormField label="City" required>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={inputClass} />
          </FormField>
          <FormRow>
            <FormField label="GSTIN">
              <input type="text" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="Optional" className={inputClass} />
            </FormField>
            <FormField label="Opening Balance (₹)">
              <input type="number" value={form.openingBalance} onChange={e => setForm({ ...form, openingBalance: Number(e.target.value), currentBalance: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Products/Parts Supplied">
            <textarea 
              value={form.products.join(', ')}
              onChange={e => setForm({ ...form, products: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
              placeholder="e.g., Display, Battery, Charger (comma-separated)"
              rows={2}
              className={textareaClass}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Add Supplier</SubmitButton>
          </div>
        </div>
      </Modal>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedSupplier(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Store size={24} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{selectedSupplier.name}</h2>
                  <p className="text-sm text-navy-500">{selectedSupplier.code}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-2 hover:bg-navy-100 rounded-lg">
                <X size={20} className="text-navy-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-navy-500" />
                    <span className="text-sm font-medium text-navy-700">Phone</span>
                  </div>
                  <p className="text-base text-navy-900">{selectedSupplier.phone}</p>
                  <a 
                    href={`https://wa.me/${selectedSupplier.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 hover:text-green-700"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                </div>
                {selectedSupplier.email && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-navy-500" />
                      <span className="text-sm font-medium text-navy-700">Email</span>
                    </div>
                    <p className="text-base text-navy-900">{selectedSupplier.email}</p>
                  </div>
                )}
                {selectedSupplier.contactPerson && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-navy-500" />
                      <span className="text-sm font-medium text-navy-700">Contact Person</span>
                    </div>
                    <p className="text-base text-navy-900">{selectedSupplier.contactPerson}</p>
                  </div>
                )}
                {selectedSupplier.address && (
                  <div className="bg-navy-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-navy-500" />
                      <span className="text-sm font-medium text-navy-700">Address</span>
                    </div>
                    <p className="text-base text-navy-900">{selectedSupplier.address}</p>
                  </div>
                )}
              </div>

              {/* Business Info */}
              {selectedSupplier.gstin && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">Business Information</h3>
                  <p className="text-sm text-navy-700"><span className="font-medium">GSTIN:</span> {selectedSupplier.gstin}</p>
                </div>
              )}

              {/* Products */}
              {selectedSupplier.products && selectedSupplier.products.length > 0 && (
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary-700 mb-2">Products/Parts Supplied</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.products.map((product, idx) => (
                      <span key={idx} className="text-xs bg-white text-primary-700 px-2 py-1 rounded">{product}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-rose-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-rose-700">₹{selectedSupplier.currentBalance.toLocaleString()}</p>
                  <p className="text-sm text-navy-600 mt-1">Current Payable</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">{selectedSupplier.totalOrders}</p>
                  <p className="text-sm text-navy-600 mt-1">Total Orders</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-navy-100">
                <button onClick={openEditModal} className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center justify-center gap-2">
                  <Edit size={16} /> Edit Supplier
                </button>
                <button onClick={() => setShowHistory(true)} className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200 flex items-center justify-center gap-2">
                  <Calendar size={16} /> View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Supplier" subtitle="Update supplier information">
        <div className="space-y-4">
          <FormRow>
            <FormField label="Supplier Code" required>
              <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SUP-005" className={inputClass} />
            </FormField>
            <FormField label="Supplier Name" required>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Company name" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Contact Person">
              <input type="text" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Contact person name" className={inputClass} />
            </FormField>
            <FormField label="Phone" required>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@supplier.com" className={inputClass} />
            </FormField>
            <FormField label="City" required>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Address">
            <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" className={inputClass} />
          </FormField>
          <FormRow>
            <FormField label="GSTIN">
              <input type="text" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="Optional" className={inputClass} />
            </FormField>
            <FormField label="Opening Balance (₹)">
              <input type="number" value={form.openingBalance} onChange={e => setForm({ ...form, openingBalance: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
          </FormRow>
          <FormField label="Products/Parts Supplied">
            <textarea 
              value={form.products.join(', ')}
              onChange={e => setForm({ ...form, products: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
              placeholder="e.g., Display, Battery, Charger (comma-separated)"
              rows={2}
              className={textareaClass}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowEdit(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleEdit}>Save Changes</SubmitButton>
          </div>
        </div>
      </Modal>

      {/* Purchase History Modal */}
      {showHistory && selectedSupplier && (() => {
        const orders = getSupplierOrders(selectedSupplier.id);
        const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowHistory(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-navy-900">Purchase History</h2>
                  <p className="text-sm text-navy-500">{selectedSupplier.name}</p>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-navy-100 rounded-lg">
                  <X size={20} className="text-navy-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Date Filter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-navy-50 rounded-lg p-1">
                    {(['today', 'week', 'month', 'all'] as const).map(period => (
                      <button
                        key={period}
                        onClick={() => setHistoryDateFilter(period)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          historyDateFilter === period ? 'bg-primary-500 text-white' : 'text-navy-600 hover:bg-navy-100'
                        }`}
                      >
                        {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All'}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleExportHistory} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50">
                    <Download size={16} /> Export CSV
                  </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-navy-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-navy-900">{orders.length}</p>
                    <p className="text-xs text-navy-500 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-primary-700">₹{totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-navy-500 mt-1">Total Amount</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700">{orders.filter(o => o.currentStock < 5).length}</p>
                    <p className="text-xs text-navy-500 mt-1">Low Stock Items</p>
                  </div>
                </div>

                {/* Orders Table */}
                {orders.length > 0 ? (
                  <div className="border border-navy-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-50">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium text-navy-600">Item</th>
                          <th className="text-center px-4 py-2 font-medium text-navy-600">Qty</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Price</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Total</th>
                          <th className="text-center px-4 py-2 font-medium text-navy-600">Stock</th>
                          <th className="text-right px-4 py-2 font-medium text-navy-600">Date</th>
                          <th className="text-center px-4 py-2 font-medium text-navy-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-50">
                        {orders.map(order => {
                          const stockStatus = getStockStatus(order.currentStock);
                          return (
                            <tr key={order.id} className="hover:bg-navy-50/50">
                              <td className="px-4 py-3">
                                <p className="font-medium text-navy-800">{order.itemName}</p>
                                {order.invoiceRef && <p className="text-xs text-navy-500">{order.invoiceRef}</p>}
                              </td>
                              <td className="px-4 py-3 text-center text-navy-700">{order.quantity}</td>
                              <td className="px-4 py-3 text-right text-navy-600">₹{order.purchasePrice.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{order.totalAmount.toLocaleString()}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
                                  {stockStatus.icon} {order.currentStock}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-navy-500">{new Date(order.purchaseDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                              <td className="px-4 py-3 text-center">
                                {order.currentStock < 5 && order.status === 'received' && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowReorder(true);
                                    }}
                                    className="text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                                  >
                                    Reorder
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-navy-200 mb-3" />
                    <p className="text-navy-500">No purchases found for this period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reorder Modal */}
      {showReorder && selectedOrder && selectedSupplier && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowReorder(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Reorder Item</h3>
            <p className="text-sm text-navy-500 mb-4">{selectedOrder.itemName}</p>
            
            <div className="space-y-4">
              <div className="bg-navy-50 rounded-lg p-3">
                <p className="text-xs text-navy-500 mb-1">Current Stock</p>
                <p className="text-lg font-bold text-navy-900">{selectedOrder.currentStock}</p>
              </div>
              
              <FormField label="Reorder Quantity" required>
                <input 
                  type="number" 
                  value={reorderQuantity}
                  onChange={e => setReorderQuantity(Number(e.target.value))}
                  min={1}
                  className={inputClass}
                />
              </FormField>
              
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-xs text-navy-600 mb-1">Estimated Total</p>
                <p className="text-lg font-bold text-primary-700">₹{(reorderQuantity * selectedOrder.purchasePrice).toLocaleString()}</p>
              </div>
              
              <FormField label="Notes (Optional)">
                <textarea 
                  value={reorderNotes}
                  onChange={e => setReorderNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={2}
                  className={textareaClass}
                />
              </FormField>
              
              <div className="flex gap-2 pt-3 border-t border-navy-100">
                <button onClick={() => setShowReorder(false)} className="flex-1 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">
                  Cancel
                </button>
                <button onClick={handleReorder} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
