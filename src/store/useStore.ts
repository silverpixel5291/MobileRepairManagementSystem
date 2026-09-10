import { useState, useCallback } from 'react';
import {
  Customer, Supplier, InventoryItem, RepairJob, Sale, ScrapRecord,
  customers as initialCustomers,
  suppliers as initialSuppliers,
  inventoryItems as initialInventory,
  repairJobs as initialRepairs,
  sales as initialSales,
  scrapRecords as initialScrap,
} from '../data/mockData';

// Simple ID generator
const genId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

export function useStore() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [repairs, setRepairs] = useState<RepairJob[]>(initialRepairs);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [scrap, setScrap] = useState<ScrapRecord[]>(initialScrap);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

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

  return {
    customers, suppliers, inventory, repairs, sales, scrap, toast,
    addCustomer, addSupplier, addInventory, addRepair, addSale, addScrap,
  };
}

export type Store = ReturnType<typeof useStore>;
