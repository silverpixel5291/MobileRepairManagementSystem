import { useState, useRef, useEffect } from 'react';
import { X, QrCode, Bell, User, LogOut, Settings, ShoppingCart, Search, Printer, Camera, Check } from 'lucide-react';
import { Modal, FormField, FormRow, inputClass, selectClass, SubmitButton } from './Modal';

// ============ SCAN MODAL ============
export function ScanModal({ open, onClose, onScan }: { open: boolean; onClose: () => void; onScan?: (token: string) => void }) {
  const [manualInput, setManualInput] = useState('');
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const tokens = ['qr_a1b2c3d4', 'qr_e5f6g7h8', 'qr_i9j0k1l2', 'DEV-2026-001', 'DEV-2026-002'];
      const random = tokens[Math.floor(Math.random() * tokens.length)];
      if (onScan) onScan(random);
      else onClose();
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Scan QR Code" subtitle="Scan item QR or enter device ID manually">
      <div className="space-y-4">
        <div className="relative bg-navy-900 rounded-xl aspect-square max-w-xs mx-auto flex items-center justify-center overflow-hidden">
          {scanning ? (
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Scanning...</p>
            </div>
          ) : (
            <div className="text-center text-white/70 p-6">
              <Camera size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Camera preview would appear here</p>
              <p className="text-xs mt-1 opacity-60">Point camera at QR code</p>
            </div>
          )}
          {/* Scan frame overlay */}
          <div className="absolute inset-8 border-2 border-primary-400 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-400 rounded-br-lg" />
          </div>
        </div>

        <button onClick={simulateScan} disabled={scanning} className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2">
          <QrCode size={18} />
          {scanning ? 'Scanning...' : 'Simulate Scan'}
        </button>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 flex items-center"><div className="flex-1 border-t border-navy-200" /><span className="px-3 text-xs text-navy-400">OR</span><div className="flex-1 border-t border-navy-200" /></div>
        </div>

        <FormField label="Enter Device ID or QR Token manually">
          <div className="flex gap-2">
            <input type="text" value={manualInput} onChange={e => setManualInput(e.target.value)} placeholder="e.g. DEV-2026-001 or qr_a1b2c3d4" className={inputClass} />
            <button onClick={() => { if (manualInput && onScan) onScan(manualInput); }} disabled={!manualInput} className="px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 disabled:opacity-50">
              <Search size={16} />
            </button>
          </div>
        </FormField>
      </div>
    </Modal>
  );
}

// ============ NOTIFICATIONS PANEL ============
interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: any[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationsPanel({ open, onClose, notifications, onMarkRead, onMarkAllRead }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal open={open} onClose={onClose} title="Notifications" subtitle={`${unreadCount} unread`}>
      <div className="space-y-2">
        <div className="flex justify-end">
          <button 
            onClick={() => onMarkAllRead?.()} 
            className="text-xs text-primary-600 font-medium hover:text-primary-700"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
        {notifications.map(notif => (
          <div key={notif.id} className={`p-3 rounded-lg border ${!notif.read ? 'bg-primary-50/50 border-primary-100' : 'bg-white border-navy-100'}`}>
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'warning' ? 'bg-amber-400' : notif.type === 'success' ? 'bg-mint-400' : notif.type === 'error' ? 'bg-rose-400' : 'bg-primary-400'} ${!notif.read ? 'animate-pulse-dot' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-800">{notif.title}</p>
                <p className="text-xs text-navy-500 mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-navy-400 mt-1">{new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              {!notif.read && onMarkRead && (
                <button 
                  onClick={() => onMarkRead(notif.id)}
                  className="text-xs text-primary-600 hover:text-primary-700 whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-8 text-navy-400">
            <Bell size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ============ PROFILE MENU ============
export function ProfileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-14 right-4 z-50 bg-white rounded-xl shadow-xl border border-navy-100 w-64 animate-fade-in overflow-hidden">
        <div className="p-4 bg-navy-50 border-b border-navy-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">A</div>
            <div>
              <p className="text-sm font-semibold text-navy-900">Admin User</p>
              <p className="text-xs text-navy-500">admin@repairshop.in</p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 rounded-lg"><Settings size={16} />Settings</button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 rounded-lg"><User size={16} />My Profile</button>
          <hr className="my-1 border-navy-100" />
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"><LogOut size={16} />Logout</button>
        </div>
      </div>
    </>
  );
}

// ============ QUICK SALE MODAL ============
interface QuickSaleProps {
  open: boolean;
  onClose: () => void;
  inventory: { id: string; name: string; sellingPrice: number; quantity: number; status: string }[];
  customers: { id: string; name: string; phone: string }[];
  onSale: (data: { customerId: string; customerName: string; items: { inventoryId: string; name: string; quantity: number; unitPrice: number; total: number }[]; subtotal: number; discount: number; taxableAmount: number; cgst: number; sgst: number; igst: number; totalAmount: number; paymentMethod: string }) => void;
}

export function QuickSaleModal({ open, onClose, inventory, customers, onSale }: QuickSaleProps) {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ inventoryId: string; name: string; quantity: number; unitPrice: number }[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);

  const availableItems = inventory.filter(i => i.status === 'available' && i.quantity > 0 && i.name.toLowerCase().includes(search.toLowerCase()));

  const addItem = (item: typeof inventory[0]) => {
    const existing = selectedItems.find(si => si.inventoryId === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(si => si.inventoryId === item.id ? { ...si, quantity: si.quantity + 1 } : si));
    } else {
      setSelectedItems([...selectedItems, { inventoryId: item.id, name: item.name, quantity: 1, unitPrice: item.sellingPrice }]);
    }
    setSearch('');
  };

  const removeItem = (id: string) => setSelectedItems(selectedItems.filter(si => si.inventoryId !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) removeItem(id);
    else setSelectedItems(selectedItems.map(si => si.inventoryId === id ? { ...si, quantity: qty } : si));
  };

  const subtotal = selectedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const taxable = subtotal - discount;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const total = taxable + cgst + sgst;

  const handleCustomerSelect = (id: string) => {
    setCustomerId(id);
    const c = customers.find(c => c.id === id);
    if (c) setCustomerName(c.name);
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0 || !customerName) return;
    onSale({
      customerId: customerId || 'walk-in',
      customerName,
      items: selectedItems.map(i => ({ ...i, total: i.unitPrice * i.quantity })),
      subtotal, discount, taxableAmount: taxable, cgst, sgst, igst: 0, totalAmount: total, paymentMethod,
    });
    setSelectedItems([]); setCustomerId(''); setCustomerName(''); setDiscount(0); setPaymentMethod('cash'); setSearch('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Quick Sale" subtitle="Fast counter transaction" size="lg">
      <div className="space-y-4">
        {/* Customer */}
        <div className="flex gap-2">
          <select value={customerId} onChange={e => handleCustomerSelect(e.target.value)} className={`${selectClass} flex-1`}>
            <option value="">Walk-in Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
          </select>
          {!customerId && <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" className={`${inputClass} flex-1`} />}
        </div>

        {/* Item Search */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Search & Add Items</label>
          <div className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2 border border-navy-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
            <Search size={16} className="text-navy-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or scan QR..." className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full" autoFocus />
          </div>
          {search && (
            <div className="mt-2 max-h-40 overflow-y-auto border border-navy-100 rounded-lg">
              {availableItems.slice(0, 8).map(item => (
                <button key={item.id} onClick={() => addItem(item)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary-50 text-left text-sm border-b border-navy-50 last:border-0">
                  <span className="text-navy-700">{item.name}</span>
                  <span className="text-navy-500">₹{item.sellingPrice} <span className="text-xs">(Qty: {item.quantity})</span></span>
                </button>
              ))}
              {availableItems.length === 0 && <p className="p-3 text-sm text-navy-400 text-center">No items found</p>}
            </div>
          )}
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="bg-navy-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-navy-600 uppercase">Cart ({selectedItems.length})</p>
            {selectedItems.map(item => (
              <div key={item.inventoryId} className="flex items-center justify-between text-sm">
                <span className="text-navy-700 flex-1 truncate">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.inventoryId, item.quantity - 1)} className="w-6 h-6 rounded bg-white border border-navy-200 text-navy-600 text-xs">−</button>
                  <span className="w-6 text-center text-navy-800 font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.inventoryId, item.quantity + 1)} className="w-6 h-6 rounded bg-white border border-navy-200 text-navy-600 text-xs">+</button>
                  <span className="w-20 text-right font-medium text-navy-800">₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeItem(item.inventoryId)} className="text-rose-500 hover:text-rose-600 text-xs ml-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {selectedItems.length > 0 && (
          <div className="bg-primary-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm"><span className="text-navy-600">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-navy-600">Discount</span><span className="font-medium text-rose-600">-₹{discount}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-navy-600">CGST + SGST (18%)</span><span className="font-medium">₹{(cgst + sgst).toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-primary-200"><span>Total</span><span className="text-primary-700">₹{total.toFixed(2)}</span></div>
          </div>
        )}

        <FormRow>
          <FormField label="Discount (₹)">
            <input type="number" value={discount || ''} onChange={e => setDiscount(Number(e.target.value))} placeholder="0" className={inputClass} />
          </FormField>
          <FormField label="Payment">
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={selectClass}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </FormField>
        </FormRow>

        <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
          <SubmitButton variant="secondary" onClick={onClose}>Cancel</SubmitButton>
          <SubmitButton onClick={handleSubmit}>Complete Sale</SubmitButton>
        </div>
      </div>
    </Modal>
  );
}

// ============ QR CODE DISPLAY ============
export function QRCodeDisplay({ deviceId, qrToken, itemName, location, onClose }: { deviceId: string; qrToken: string; itemName: string; location?: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate a simple QR-like pattern
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#0d1423';

    // Draw QR-like pattern based on token hash
    const hash = qrToken.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const cellSize = 8;
    const gridSize = Math.floor(size / cellSize);

    // Position detection patterns (corners)
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, cellSize * 7, cellSize);
      ctx.fillRect(x, y + cellSize * 6, cellSize * 7, cellSize);
      ctx.fillRect(x, y, cellSize, cellSize * 7);
      ctx.fillRect(x + cellSize * 6, y, cellSize, cellSize * 7);
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    };
    drawFinder(0, 0);
    drawFinder(size - cellSize * 7, 0);
    drawFinder(0, size - cellSize * 7);

    // Fill data area with pseudo-random pattern
    for (let y = 8; y < gridSize - 1; y++) {
      for (let x = 8; x < gridSize - 1; x++) {
        if ((hash * (x + 1) * (y + 1) + x * y) % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [qrToken]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>QR Label - ${deviceId}</title>
      <style>body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
      .label{text-align:center;padding:20px;border:2px solid #000;border-radius:8px;max-width:300px}
      img{width:180px;height:180px}h3{margin:8px 0 4px;font-size:14px}p{margin:2px 0;font-size:11px;color:#555}</style></head>
      <body><div class="label">
      <img src="${canvasRef.current?.toDataURL()}" />
      <h3>${itemName}</h3>
      <p><strong>${deviceId}</strong></p>
      ${location ? `<p>Location: ${location}</p>` : ''}
      <p style="font-size:9px;margin-top:8px">RepairOS</p>
      </div></body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  return (
    <Modal open={true} onClose={onClose} title="QR Code Label" subtitle={deviceId}>
      <div className="text-center space-y-4">
        <div className="inline-block bg-white p-4 rounded-xl border-2 border-navy-100">
          <canvas ref={canvasRef} className="w-48 h-48" />
        </div>
        <div>
          <p className="font-semibold text-navy-900">{itemName}</p>
          <p className="text-sm text-navy-500">{deviceId}</p>
          {location && <p className="text-xs text-navy-400 mt-1">📍 {location}</p>}
        </div>
        <div className="flex gap-2 justify-center pt-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
            <Printer size={16} /> Print Label
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">Close</button>
        </div>
      </div>
    </Modal>
  );
}
