import { useState, useCallback, useEffect } from 'react';
import {
  Customer, Supplier, InventoryItem, RepairJob, Sale, ScrapRecord, Notification, PurchaseOrder,
  customers as initialCustomers,
  suppliers as initialSuppliers,
  inventoryItems as initialInventory,
  repairJobs as initialRepairs,
  sales as initialSales,
  scrapRecords as initialScrap,
  notifications as initialNotifications,
  purchaseOrders as initialPurchaseOrders,
} from '../data/mockData';

// Simple ID generator
const genId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

// LocalStorage helpers
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export function useStore() {
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('repairos_customers', initialCustomers));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromStorage('repairos_suppliers', initialSuppliers));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadFromStorage('repairos_inventory', initialInventory));
  const [repairs, setRepairs] = useState<RepairJob[]>(() => loadFromStorage('repairos_repairs', initialRepairs));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage('repairos_sales', initialSales));
  const [scrap, setScrap] = useState<ScrapRecord[]>(() => loadFromStorage('repairos_scrap', initialScrap));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('repairos_notifications', initialNotifications));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadFromStorage('repairos_purchase_orders', initialPurchaseOrders));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Persist to localStorage on changes
  useEffect(() => { saveToStorage('repairos_customers', customers); }, [customers]);
  useEffect(() => { saveToStorage('repairos_suppliers', suppliers); }, [suppliers]);
  useEffect(() => { saveToStorage('repairos_inventory', inventory); }, [inventory]);
  useEffect(() => { saveToStorage('repairos_repairs', repairs); }, [repairs]);
  useEffect(() => { saveToStorage('repairos_sales', sales); }, [sales]);
  useEffect(() => { saveToStorage('repairos_scrap', scrap); }, [scrap]);
  useEffect(() => { saveToStorage('repairos_notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('repairos_purchase_orders', purchaseOrders); }, [purchaseOrders]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addCustomer = useCallback((data: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'totalRepairs'>) => {
    const newCustomer: Customer = {
      ...data,
      id: genId('c'),
      createdAt: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
      totalRepairs: 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    showToast(`Customer "${data.name}" added`);
    return newCustomer;
  }, [showToast]);

  const addSupplier = useCallback((data: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...data, id: genId('s') };
    setSuppliers(prev => [newSupplier, ...prev]);
    showToast(`Supplier "${data.name}" added`);
    return newSupplier;
  }, [showToast]);

  const addInventory = useCallback((data: Omit<InventoryItem, 'id' | 'deviceId' | 'qrToken' | 'createdAt' | 'lastMovement'>) => {
    const count = inventory.length + 1;
    const newItem: InventoryItem = {
      ...data,
      id: genId('i'),
      deviceId: `DEV-2026-${String(count).padStart(3, '0')}`,
      qrToken: `qr_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastMovement: new Date().toISOString().split('T')[0],
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Item "${data.name}" added to inventory`);
    return newItem;
  }, [inventory.length, showToast]);

  const addRepair = useCallback((data: Omit<RepairJob, 'id' | 'repairNumber' | 'trackingToken' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const count = repairs.length + 1;
    const newRepair: RepairJob = {
      ...data,
      id: genId('r'),
      repairNumber: `RPR-2026-${String(count).padStart(4, '0')}`,
      trackingToken: `trk_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [{
        id: genId('t'),
        status: 'received',
        message: 'Device received at counter',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        isCustomerVisible: true,
      }],
    };
    setRepairs(prev => [newRepair, ...prev]);
    showToast(`Repair job ${newRepair.repairNumber} created`);
    return newRepair;
  }, [repairs.length, showToast]);

  const addSale = useCallback((data: Omit<Sale, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const count = sales.length + 1;
    const newSale: Sale = {
      ...data,
      id: genId('sale'),
      invoiceNumber: `INV-2026-${String(count).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
    // Mark sold items
    data.items.forEach(item => {
      setInventory(prev => prev.map(inv =>
        inv.id === item.inventoryId
          ? { ...inv, quantity: inv.quantity - item.quantity, status: inv.quantity - item.quantity <= 0 ? 'sold' : inv.status }
          : inv
      ));
    });
    showToast(`Sale ${newSale.invoiceNumber} created — ₹${newSale.totalAmount.toLocaleString()}`);
    return newSale;
  }, [sales.length, showToast]);

  const updateSale = useCallback((saleId: string, updatedData: Partial<Sale>) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, ...updatedData } : sale
    ));
    showToast('Invoice updated successfully', 'success');
  }, [showToast]);

  const deleteSale = useCallback((saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;
    
    // Restore inventory quantities
    sale.items.forEach(item => {
      setInventory(prev => prev.map(inv =>
        inv.id === item.inventoryId
          ? { ...inv, quantity: inv.quantity + item.quantity, status: 'available' }
          : inv
      ));
    });
    
    setSales(prev => prev.filter(s => s.id !== saleId));
    showToast(`Invoice ${sale.invoiceNumber} deleted`, 'success');
  }, [sales, showToast]);

  const updateCustomer = useCallback((customerId: string, updatedData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updatedData } : customer
    ));
    showToast('Customer updated successfully', 'success');
  }, [showToast]);

  const updateSupplier = useCallback((supplierId: string, updatedData: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, ...updatedData } : supplier
    ));
    showToast('Supplier updated successfully', 'success');
  }, [showToast]);

  const addPurchaseOrder = useCallback((data: Omit<PurchaseOrder, 'id'>) => {
    const newOrder: PurchaseOrder = {
      ...data,
      id: genId('po'),
    };
    setPurchaseOrders(prev => [newOrder, ...prev]);
    
    // Update supplier balance
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === data.supplierId 
        ? { ...supplier, currentBalance: supplier.currentBalance + data.totalAmount, totalOrders: supplier.totalOrders + 1 }
        : supplier
    ));
    
    showToast(`Purchase order created for ₹${data.totalAmount.toLocaleString()}`, 'success');
    return newOrder;
  }, [showToast]);

  const updatePurchaseOrderStatus = useCallback((orderId: string, status: 'received' | 'pending' | 'cancelled') => {
    setPurchaseOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    showToast(`Purchase order status updated to ${status}`, 'success');
  }, [showToast]);

  const addScrap = useCallback((data: Omit<ScrapRecord, 'id' | 'createdAt'>) => {
    const newScrap: ScrapRecord = {
      ...data,
      id: genId('sc'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setScrap(prev => [newScrap, ...prev]);
    showToast(`Scrap record added — ₹${data.recoveryValue} recovery`);
    return newScrap;
  }, [showToast]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const updateRepairStatus = useCallback((repairId: string, newStatus: string, message: string, user: string) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        const newTimelineEntry = {
          id: genId('t'),
          status: newStatus as any,
          message,
          user,
          timestamp: new Date().toISOString(),
          isCustomerVisible: true,
        };
        return {
          ...repair,
          status: newStatus as any,
          updatedAt: new Date().toISOString(),
          timeline: [...repair.timeline, newTimelineEntry],
        };
      }
      return repair;
    }));
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
  }, [showToast]);

  const addRepairNote = useCallback((repairId: string, note: string, user: string) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        const newTimelineEntry = {
          id: genId('t'),
          status: repair.status,
          message: note,
          user,
          timestamp: new Date().toISOString(),
          isCustomerVisible: false,
        };
        return {
          ...repair,
          updatedAt: new Date().toISOString(),
          timeline: [...repair.timeline, newTimelineEntry],
        };
      }
      return repair;
    }));
    showToast('Note added successfully', 'success');
  }, [showToast]);

  const updateRepairInitialCheck = useCallback((repairId: string, initialCheck: any[]) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          initialCheck,
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
  }, []);

  const updateRepairDiagnosis = useCallback((repairId: string, diagnosis: any) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          diagnosis,
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
  }, []);

  const updateRepairActions = useCallback((repairId: string, repairActions: any[]) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          repairActions,
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
  }, []);

  const addPartRequest = useCallback((repairId: string, partRequest: any) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        const partsRequested = repair.partsRequested || [];
        return {
          ...repair,
          partsRequested: [...partsRequested, { ...partRequest, id: genId('pr') }],
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
    showToast('Part request added', 'success');
  }, [showToast]);

  const addRepairPhoto = useCallback((repairId: string, photo: any) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        const photos = repair.photos || [];
        return {
          ...repair,
          photos: [...photos, { ...photo, id: genId('p') }],
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
    showToast('Photo added', 'success');
  }, [showToast]);

  const updateTechnicianNotes = useCallback((repairId: string, notes: string) => {
    setRepairs(prev => prev.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          technicianNotes: notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return repair;
    }));
  }, []);

  return {
    customers, suppliers, inventory, repairs, sales, scrap, notifications, purchaseOrders, toast, showToast,
    addCustomer, addSupplier, addInventory, addRepair, addSale, addScrap,
    updateSale, deleteSale, updateCustomer, updateSupplier,
    addPurchaseOrder, updatePurchaseOrderStatus,
    markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
    updateRepairStatus, addRepairNote,
    updateRepairInitialCheck, updateRepairDiagnosis, updateRepairActions,
    addPartRequest, addRepairPhoto, updateTechnicianNotes,
  };
}

export type Store = ReturnType<typeof useStore>;
