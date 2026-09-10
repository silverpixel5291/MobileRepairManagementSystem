import { useState } from 'react';
import { Plus, Download, FileText, Search, ShoppingCart } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, SubmitButton } from '../components/Modal';
import { Store } from '../store/useStore';
import { PaymentMethod } from '../data/mockData';

export function Sales({ store }: { store: Store }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    customerId: '', customerName: '', items: [] as { inventoryId: string; name: string; quantity: number; unitPrice: number; total: number }[],
    selectedItem: '', quantity: 1, discount: 0, paymentMethod: 'cash' as PaymentMethod,
  });

  const filtered = store.sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = store.sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTax = store.sales.reduce((sum, s) => sum + s.cgst + s.sgst + s.igst, 0);

  const addItemToSale = () => {
    const item = store.inventory.find(i => i.id === form.selectedItem);
    if (!item) return;
    const qty = Math.min(form.quantity, item.quantity);
    const newItem = { inventoryId: item.id, name: item.name, quantity: qty, unitPrice: item.sellingPrice, total: qty * item.sellingPrice };
    setForm({ ...form, items: [...form.items, newItem], selectedItem: '', quantity: 1 });
  };

  const removeItem = (idx: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const subtotal = form.items.reduce((sum, i) => sum + i.total, 0);
  const taxableAmount = subtotal - form.discount;
  const taxRate = 0.18;
  const cgst = taxableAmount * taxRate / 2;
  const sgst = taxableAmount * taxRate / 2;
  const totalAmount = taxableAmount + cgst + sgst;

  const handleCustomerSelect = (custId: string) => {
    const cust = store.customers.find(c => c.id === custId);
    if (cust) setForm({ ...form, customerId: cust.id, customerName: cust.name });
  };

  const handleSubmit = () => {
    if (!form.customerName || form.items.length === 0) return;
    store.addSale({
      customerId: form.customerId || 'walk-in',
      customerName: form.customerName,
      items: form.items,
      subtotal,
      discount: form.discount,
      taxableAmount,
      cgst,
      sgst,
      igst: 0,
      totalAmount,
      paymentMethod: form.paymentMethod,
    });
    setForm({ customerId: '', customerName: '', items: [], selectedItem: '', quantity: 1, discount: 0, paymentMethod: 'cash' });
    setShowAdd(false);
  };

  const availableItems = store.inventory.filter(i => i.status === 'available' && i.quantity > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Sales</h1>
          <p className="text-sm text-navy-500">{store.sales.length} invoices • ₹{totalRevenue.toLocaleString()} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 rounded-lg text-sm text-navy-700 hover:bg-navy-50"><Download size={16} />Export</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm"><Plus size={16} />New Sale</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><p className="text-xs text-navy-500">Total Revenue</p><p className="text-xl font-bold text-navy-900 mt-1">₹{totalRevenue.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><p className="text-xs text-navy-500">GST Collected</p><p className="text-xl font-bold text-navy-900 mt-1">₹{totalTax.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><p className="text-xs text-navy-500">Invoices</p><p className="text-xl font-bold text-navy-900 mt-1">{store.sales.length}</p></div>
        <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"><p className="text-xs text-navy-500">Avg. Order Value</p><p className="text-xl font-bold text-navy-900 mt-1">₹{store.sales.length > 0 ? Math.round(totalRevenue / store.sales.length).toLocaleString() : 0}</p></div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2">
          <Search size={16} className="text-navy-400" />
          <input type="text" placeholder="Search by invoice number or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Invoice</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden md:table-cell">Items</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden sm:table-cell">Payment</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-navy-500 uppercase hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map(sale => (
                <tr key={sale.id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={16} className="text-primary-500" /><span className="font-medium text-navy-800">{sale.invoiceNumber}</span></div></td>
                  <td className="px-4 py-3 text-navy-700">{sale.customerName}</td>
                  <td className="px-4 py-3 text-navy-500 hidden md:table-cell">{sale.items.length} item(s)</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-800">₹{sale.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell"><span className="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded capitalize">{sale.paymentMethod.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3 text-right text-navy-500 hidden lg:table-cell">{new Date(sale.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12"><ShoppingCart size={48} className="mx-auto text-navy-200 mb-3" /><p className="text-navy-500">No sales found.</p></div>
      )}

      {/* New Sale Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Sale" subtitle="Create a new sales invoice" size="lg">
        <div className="space-y-4">
          <FormField label="Customer" required>
            <select value={form.customerId} onChange={e => handleCustomerSelect(e.target.value)} className={selectClass}>
              <option value="">Walk-in Customer</option>
              {store.customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
            </select>
          </FormField>
          {!form.customerId && (
            <FormField label="Customer Name (Walk-in)" required>
              <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Enter customer name" className={inputClass} />
            </FormField>
          )}

          <div className="border-t border-navy-100 pt-4">
            <p className="text-sm font-semibold text-navy-800 mb-3">Add Items</p>
            <div className="flex gap-2 mb-3">
              <select value={form.selectedItem} onChange={e => setForm({ ...form, selectedItem: e.target.value })} className={`${selectClass} flex-1`}>
                <option value="">Select item...</option>
                {availableItems.map(i => <option key={i.id} value={i.id}>{i.name} — ₹{i.sellingPrice} (Qty: {i.quantity})</option>)}
              </select>
              <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} min={1} className={`${inputClass} w-20`} placeholder="Qty" />
              <button onClick={addItemToSale} disabled={!form.selectedItem} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">Add</button>
            </div>

            {form.items.length > 0 && (
              <div className="bg-navy-50 rounded-lg p-3 space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-navy-700">{item.name} × {item.quantity}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-navy-800">₹{item.total.toLocaleString()}</span>
                      <button onClick={() => removeItem(idx)} className="text-rose-500 hover:text-rose-600 text-xs">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormRow>
            <FormField label="Discount (₹)">
              <input type="number" value={form.discount || ''} onChange={e => setForm({ ...form, discount: Number(e.target.value) })} placeholder="0" className={inputClass} />
            </FormField>
            <FormField label="Payment Method">
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })} className={selectClass}>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </FormField>
          </FormRow>

          {form.items.length > 0 && (
            <div className="bg-primary-50 rounded-lg p-4 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-navy-600">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
              {form.discount > 0 && <div className="flex justify-between text-sm"><span className="text-navy-600">Discount</span><span className="font-medium text-rose-600">-₹{form.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-navy-600">CGST (9%)</span><span className="font-medium">₹{cgst.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-navy-600">SGST (9%)</span><span className="font-medium">₹{sgst.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-primary-200"><span className="text-navy-800">Total</span><span className="text-primary-700">₹{totalAmount.toFixed(2)}</span></div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
            <SubmitButton variant="secondary" onClick={() => setShowAdd(false)}>Cancel</SubmitButton>
            <SubmitButton onClick={handleSubmit}>Create Sale</SubmitButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
