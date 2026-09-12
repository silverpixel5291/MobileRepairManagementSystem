export type RepairStatus = 'received' | 'diagnosing' | 'estimate_generated' | 'approved' | 'working' | 'waiting_parts' | 'quality_check' | 'ready_pickup' | 'delivered' | 'cannot_repair';
export type InventoryStatus = 'available' | 'sold' | 'in_repair' | 'scrapped' | 'reserved';
export type ItemCategory = 'mobile' | 'accessory' | 'spare_part' | 'other';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  birthday?: string;
  type: 'individual' | 'business';
  createdAt: string;
  totalPurchases: number;
  totalRepairs: number;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  gstin?: string;
  openingBalance: number;
  currentBalance: number;
  totalOrders: number;
  products?: string[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  itemName: string;
  quantity: number;
  purchasePrice: number;
  totalAmount: number;
  purchaseDate: string;
  invoiceRef?: string;
  currentStock: number;
  status: 'received' | 'pending' | 'cancelled';
}

export interface InventoryItem {
  id: string;
  deviceId: string;
  qrToken: string;
  name: string;
  category: ItemCategory;
  brand: string;
  model?: string;
  imei?: string;
  ram?: string;
  rom?: string;
  condition?: string;
  costPrice: number;
  sellingPrice: number;
  minSellingPrice?: number;
  quantity: number;
  minStock: number;
  status: InventoryStatus;
  rack?: string;
  box?: string;
  supplierId?: string;
  sellerId?: string;
  photos: string[];
  createdAt: string;
  lastMovement: string;
}

export interface InitialCheckItem {
  component: string;
  status: 'pass' | 'fail' | 'issue' | 'na' | null;
}

export interface DiagnosisData {
  problems: string[];
  rootCause: string;
  observations: string;
  result: string;
}

export interface RepairAction {
  action: string;
  selected: boolean;
}

export interface PartRequest {
  id: string;
  partId: string;
  partName: string;
  compatibleModel?: string;
  availableQuantity: number;
  rack?: string;
  box?: string;
  deviceId?: string;
  quantityRequired: number;
  status: 'requested' | 'approved' | 'received';
}

export interface RepairPhoto {
  id: string;
  type: 'before' | 'during' | 'after';
  url: string;
  timestamp: string;
  note?: string;
}

export interface RepairLocation {
  rack: string;
  box: string;
  compartment?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface RepairJob {
  id: string;
  repairNumber: string;
  trackingToken: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deviceId?: string;
  deviceName?: string;
  deviceBrand?: string;
  deviceModel?: string;
  problem: string;
  priority: Priority;
  status: RepairStatus;
  estimate?: number;
  assignedTo?: string;
  assignedToName?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: RepairTimelineEntry[];
  
  // Location tracking
  currentLocation?: RepairLocation;
  locationHistory?: RepairLocation[];
  
  // Workspace data
  initialCheck?: InitialCheckItem[];
  diagnosis?: DiagnosisData;
  repairActions?: RepairAction[];
  partsRequested?: PartRequest[];
  photos?: RepairPhoto[];
  technicianNotes?: string;
}

export interface RepairTimelineEntry {
  id: string;
  status: RepairStatus;
  message: string;
  user: string;
  timestamp: string;
  isCustomerVisible: boolean;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface SaleItem {
  inventoryId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ScrapCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface ScrapRecord {
  id: string;
  itemName: string;
  categoryId: string;
  category: string;
  quantity: number;
  reason: string;
  recoveryValue: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

// Mock Data
export const customers: Customer[] = [
  { id: 'c1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', address: '12 MG Road, Bangalore', type: 'individual', createdAt: '2026-08-15', totalPurchases: 3, totalRepairs: 2 },
  { id: 'c2', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@email.com', address: '45 Park Street, Mumbai', type: 'individual', createdAt: '2026-07-22', totalPurchases: 1, totalRepairs: 4 },
  { id: 'c3', name: 'Mobile World Store', phone: '+91 76543 21098', email: 'info@mobileworld.in', address: '78 Commercial Hub, Delhi', gstin: '07AABCM1234F1ZP', type: 'business', createdAt: '2026-06-10', totalPurchases: 12, totalRepairs: 0 },
  { id: 'c4', name: 'Amit Patel', phone: '+91 65432 10987', address: '23 Ring Road, Ahmedabad', type: 'individual', createdAt: '2026-09-01', totalPurchases: 0, totalRepairs: 1 },
  { id: 'c5', name: 'Sneha Reddy', phone: '+91 54321 09876', email: 'sneha.r@email.com', address: '56 Jubilee Hills, Hyderabad', type: 'individual', createdAt: '2026-08-28', totalPurchases: 2, totalRepairs: 3 },
  { id: 'c6', name: 'TechFix Solutions', phone: '+91 43210 98765', email: 'orders@techfix.in', address: '90 IT Park, Pune', gstin: '27AABCT5678G2ZQ', type: 'business', createdAt: '2026-05-18', totalPurchases: 25, totalRepairs: 0 },
];

export const suppliers: Supplier[] = [
  { 
    id: 's1', 
    code: 'SUP-001', 
    name: 'Samsung Parts India', 
    contactPerson: 'Rajesh Mehta',
    phone: '+91 99887 76655', 
    email: 'orders@samsungparts.in', 
    city: 'Bangalore', 
    address: '45 Industrial Area, Phase 2, Bangalore - 560001',
    gstin: '29AABCS1234H1ZR', 
    openingBalance: 0, 
    currentBalance: 45000, 
    totalOrders: 18,
    products: ['Samsung Display', 'Samsung Battery', 'Samsung Charging Port', 'Samsung Back Panel']
  },
  { 
    id: 's2', 
    code: 'SUP-002', 
    name: 'Mobile Accessories Hub', 
    contactPerson: 'Priya Sharma',
    phone: '+91 88776 65544', 
    email: 'sales@mahub.in', 
    city: 'Delhi', 
    address: '123 Karol Bagh, New Delhi - 110005',
    gstin: '07AABCM5678J2ZS', 
    openingBalance: 5000, 
    currentBalance: 28500, 
    totalOrders: 32,
    products: ['Chargers', 'Cables', 'Screen Protectors', 'Phone Cases', 'Earphones']
  },
  { 
    id: 's3', 
    code: 'SUP-003', 
    name: 'Display Solutions Pvt Ltd', 
    contactPerson: 'Amit Patel',
    phone: '+91 77665 54433', 
    email: 'info@displaysol.com', 
    city: 'Mumbai', 
    address: '78 Andheri East, Mumbai - 400069',
    gstin: '27AABCD9012K3ZT', 
    openingBalance: 12000, 
    currentBalance: 67000, 
    totalOrders: 8,
    products: ['iPhone Display', 'Android Display', 'OLED Display', 'LCD Display']
  },
  { 
    id: 's4', 
    code: 'SUP-004', 
    name: 'Battery World', 
    contactPerson: 'Suresh Kumar',
    phone: '+91 66554 43322', 
    city: 'Chennai',
    address: '56 T Nagar, Chennai - 600017',
    openingBalance: 0, 
    currentBalance: 15000, 
    totalOrders: 14,
    products: ['iPhone Battery', 'Samsung Battery', 'OnePlus Battery', 'Universal Battery']
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  // Samsung Parts India purchases
  { id: 'po1', supplierId: 's1', itemName: 'Samsung Galaxy S22 Display', quantity: 5, purchasePrice: 3500, totalAmount: 17500, purchaseDate: '2026-09-01', invoiceRef: 'INV-SPI-001', currentStock: 5, status: 'received' },
  { id: 'po2', supplierId: 's1', itemName: 'Samsung Galaxy S23 Battery', quantity: 10, purchasePrice: 1800, totalAmount: 18000, purchaseDate: '2026-08-25', invoiceRef: 'INV-SPI-002', currentStock: 8, status: 'received' },
  { id: 'po3', supplierId: 's1', itemName: 'Samsung Charging Port', quantity: 15, purchasePrice: 450, totalAmount: 6750, purchaseDate: '2026-08-20', invoiceRef: 'INV-SPI-003', currentStock: 12, status: 'received' },
  { id: 'po4', supplierId: 's1', itemName: 'Samsung Back Panel', quantity: 8, purchasePrice: 1200, totalAmount: 9600, purchaseDate: '2026-09-05', invoiceRef: 'INV-SPI-004', currentStock: 0, status: 'pending' },
  
  // Mobile Accessories Hub purchases
  { id: 'po5', supplierId: 's2', itemName: 'Type-C Fast Charger', quantity: 50, purchasePrice: 250, totalAmount: 12500, purchaseDate: '2026-09-03', invoiceRef: 'INV-MAH-001', currentStock: 25, status: 'received' },
  { id: 'po6', supplierId: 's2', itemName: 'USB-C Cable (1m)', quantity: 100, purchasePrice: 80, totalAmount: 8000, purchaseDate: '2026-08-28', invoiceRef: 'INV-MAH-002', currentStock: 8, status: 'received' },
  { id: 'po7', supplierId: 's2', itemName: 'Screen Protector (Universal)', quantity: 200, purchasePrice: 25, totalAmount: 5000, purchaseDate: '2026-08-15', invoiceRef: 'INV-MAH-003', currentStock: 50, status: 'received' },
  { id: 'po8', supplierId: 's2', itemName: 'Phone Cases (Mixed)', quantity: 30, purchasePrice: 150, totalAmount: 4500, purchaseDate: '2026-09-06', invoiceRef: 'INV-MAH-004', currentStock: 30, status: 'pending' },
  
  // Display Solutions purchases
  { id: 'po9', supplierId: 's3', itemName: 'iPhone 13 Display', quantity: 3, purchasePrice: 8500, totalAmount: 25500, purchaseDate: '2026-09-02', invoiceRef: 'INV-DS-001', currentStock: 2, status: 'received' },
  { id: 'po10', supplierId: 's3', itemName: 'iPhone 14 Display', quantity: 2, purchasePrice: 12000, totalAmount: 24000, purchaseDate: '2026-08-30', invoiceRef: 'INV-DS-002', currentStock: 0, status: 'received' },
  { id: 'po11', supplierId: 's3', itemName: 'Samsung A54 Display', quantity: 5, purchasePrice: 4500, totalAmount: 22500, purchaseDate: '2026-09-04', invoiceRef: 'INV-DS-003', currentStock: 5, status: 'pending' },
  
  // Battery World purchases
  { id: 'po12', supplierId: 's4', itemName: 'iPhone 13 Battery', quantity: 10, purchasePrice: 1800, totalAmount: 18000, purchaseDate: '2026-09-01', invoiceRef: 'INV-BW-001', currentStock: 2, status: 'received' },
  { id: 'po13', supplierId: 's4', itemName: 'Samsung S22 Battery', quantity: 8, purchasePrice: 2200, totalAmount: 17600, purchaseDate: '2026-08-22', invoiceRef: 'INV-BW-002', currentStock: 6, status: 'received' },
  { id: 'po14', supplierId: 's4', itemName: 'OnePlus Nord Battery', quantity: 5, purchasePrice: 1500, totalAmount: 7500, purchaseDate: '2026-09-05', invoiceRef: 'INV-BW-003', currentStock: 0, status: 'pending' },
];

export const inventoryItems: InventoryItem[] = [
  { id: 'i1', deviceId: 'DEV-2026-001', qrToken: 'qr_a1b2c3d4', name: 'Samsung Galaxy S23', category: 'mobile', brand: 'Samsung', model: 'Galaxy S23', imei: '353456789012345', ram: '8GB', rom: '128GB', condition: 'Excellent', costPrice: 32000, sellingPrice: 38000, minSellingPrice: 35000, quantity: 1, minStock: 0, status: 'available', rack: 'R-01', box: 'B-03', sellerId: 'c1', photos: [], createdAt: '2026-09-01', lastMovement: '2026-09-01' },
  { id: 'i2', deviceId: 'DEV-2026-002', qrToken: 'qr_e5f6g7h8', name: 'iPhone 14 Pro', category: 'mobile', brand: 'Apple', model: 'iPhone 14 Pro', imei: '353456789012346', ram: '6GB', rom: '256GB', condition: 'Good', costPrice: 45000, sellingPrice: 52000, minSellingPrice: 48000, quantity: 1, minStock: 0, status: 'available', rack: 'R-01', box: 'B-05', photos: [], createdAt: '2026-09-02', lastMovement: '2026-09-02' },
  { id: 'i3', deviceId: 'DEV-2026-003', qrToken: 'qr_i9j0k1l2', name: 'Type-C Fast Charger', category: 'accessory', brand: 'Anker', quantity: 25, minStock: 10, costPrice: 250, sellingPrice: 499, minSellingPrice: 399, status: 'available', rack: 'R-03', box: 'B-01', supplierId: 's2', photos: [], createdAt: '2026-08-20', lastMovement: '2026-09-05' },
  { id: 'i4', deviceId: 'DEV-2026-004', qrToken: 'qr_m3n4o5p6', name: 'Samsung Galaxy S22 Display', category: 'spare_part', brand: 'Samsung', model: 'Galaxy S22', quantity: 5, minStock: 3, costPrice: 3500, sellingPrice: 5500, minSellingPrice: 4800, status: 'available', rack: 'R-04', box: 'B-02', supplierId: 's1', photos: [], createdAt: '2026-08-15', lastMovement: '2026-09-04' },
  { id: 'i5', deviceId: 'DEV-2026-005', qrToken: 'qr_q7r8s9t0', name: 'iPhone 13 Battery', category: 'spare_part', brand: 'Apple', model: 'iPhone 13', quantity: 2, minStock: 3, costPrice: 1800, sellingPrice: 2800, status: 'available', rack: 'R-04', box: 'B-04', supplierId: 's4', photos: [], createdAt: '2026-08-10', lastMovement: '2026-09-03' },
  { id: 'i6', deviceId: 'DEV-2026-006', qrToken: 'qr_u1v2w3x4', name: 'OnePlus Nord CE 3', category: 'mobile', brand: 'OnePlus', model: 'Nord CE 3', imei: '353456789012347', ram: '12GB', rom: '256GB', condition: 'Like New', costPrice: 18000, sellingPrice: 22000, minSellingPrice: 20000, quantity: 1, minStock: 0, status: 'in_repair', rack: 'R-02', box: 'B-01', photos: [], createdAt: '2026-09-03', lastMovement: '2026-09-05' },
  { id: 'i7', deviceId: 'DEV-2026-007', qrToken: 'qr_y5z6a7b8', name: 'USB-C Cable (1m)', category: 'accessory', brand: 'Boat', quantity: 8, minStock: 15, costPrice: 80, sellingPrice: 199, status: 'available', rack: 'R-03', box: 'B-02', supplierId: 's2', photos: [], createdAt: '2026-08-25', lastMovement: '2026-09-06' },
  { id: 'i8', deviceId: 'DEV-2026-008', qrToken: 'qr_c9d0e1f2', name: 'Xiaomi Redmi Note 12', category: 'mobile', brand: 'Xiaomi', model: 'Redmi Note 12', imei: '353456789012348', ram: '6GB', rom: '128GB', condition: 'Fair', costPrice: 8000, sellingPrice: 10500, minSellingPrice: 9500, quantity: 1, minStock: 0, status: 'sold', rack: 'R-01', box: 'B-07', photos: [], createdAt: '2026-08-28', lastMovement: '2026-09-05' },
  { id: 'i9', deviceId: 'DEV-2026-009', qrToken: 'qr_g3h4i5j6', name: 'Screen Protector (Universal)', category: 'accessory', brand: 'Generic', quantity: 50, minStock: 20, costPrice: 25, sellingPrice: 99, status: 'available', rack: 'R-03', box: 'B-05', supplierId: 's2', photos: [], createdAt: '2026-08-01', lastMovement: '2026-09-06' },
  { id: 'i10', deviceId: 'DEV-2026-010', qrToken: 'qr_k7l8m9n0', name: 'Vivo V29 Pro', category: 'mobile', brand: 'Vivo', model: 'V29 Pro', condition: 'Good', costPrice: 15000, sellingPrice: 18500, minSellingPrice: 17000, quantity: 1, minStock: 0, status: 'available', rack: 'R-01', box: 'B-09', photos: [], createdAt: '2026-09-04', lastMovement: '2026-09-04' },
];

export const repairJobs: RepairJob[] = [
  {
    id: 'r1', repairNumber: 'RPR-2026-0042', trackingToken: 'trk_x7y8z9w0',
    customerId: 'c2', customerName: 'Priya Sharma', customerPhone: '+91 87654 32109',
    deviceId: 'i6', deviceName: 'OnePlus Nord CE 3', deviceBrand: 'OnePlus', deviceModel: 'Nord CE 3',
    problem: 'Display not responding after water damage', priority: 'high',
    status: 'working', estimate: 4500, assignedTo: 'tech1', assignedToName: 'Vikram Singh',
    createdAt: '2026-09-03T10:30:00', updatedAt: '2026-09-06T14:20:00',
    initialCheck: [
      { component: 'Display', status: 'fail' },
      { component: 'Touch', status: 'fail' },
      { component: 'Camera', status: 'pass' },
      { component: 'Speaker', status: 'pass' },
      { component: 'Microphone', status: 'pass' },
      { component: 'Charging', status: 'pass' },
      { component: 'Buttons', status: 'pass' },
      { component: 'Network/SIM', status: 'pass' },
      { component: 'Wi-Fi/Bluetooth', status: 'pass' },
      { component: 'Battery', status: 'pass' },
    ],
    diagnosis: {
      problems: ['Water damage', 'Display failure'],
      rootCause: 'Water ingress caused display connector corrosion',
      observations: 'Visible water damage indicators triggered, display connector shows corrosion',
      result: 'Display replacement required'
    },
    repairActions: [
      { action: 'Display replacement', selected: true },
      { action: 'Cleaning', selected: true },
      { action: 'Battery replacement', selected: false },
      { action: 'Software reset', selected: false },
    ],
    photos: [
      { id: 'p1', type: 'before', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', timestamp: '2026-09-03T14:00:00', note: 'Water damage visible' },
    ],
    timeline: [
      { id: 't1', status: 'received', message: 'Device received at counter', user: 'Admin', timestamp: '2026-09-03T10:30:00', isCustomerVisible: true },
      { id: 't2', status: 'diagnosing', message: 'Diagnosing water damage extent', user: 'Vikram Singh', timestamp: '2026-09-03T14:00:00', isCustomerVisible: true },
      { id: 't3', status: 'estimate_generated', message: 'Estimate: ₹4,500 for display replacement and cleaning', user: 'Vikram Singh', timestamp: '2026-09-04T11:00:00', isCustomerVisible: true },
      { id: 't4', status: 'approved', message: 'Customer approved the estimate', user: 'Admin', timestamp: '2026-09-05T09:15:00', isCustomerVisible: true },
      { id: 't5', status: 'working', message: 'Started display replacement', user: 'Vikram Singh', timestamp: '2026-09-06T14:20:00', isCustomerVisible: false },
    ]
  },
  {
    id: 'r2', repairNumber: 'RPR-2026-0043', trackingToken: 'trk_a1b2c3d4',
    customerId: 'c4', customerName: 'Amit Patel', customerPhone: '+91 65432 10987',
    deviceName: 'Samsung Galaxy A54', deviceBrand: 'Samsung', deviceModel: 'Galaxy A54',
    problem: 'Battery draining very fast, phone heats up', priority: 'medium',
    status: 'waiting_parts', estimate: 2200, assignedTo: 'tech2', assignedToName: 'Ravi Kumar',
    createdAt: '2026-09-04T09:00:00', updatedAt: '2026-09-06T16:30:00',
    initialCheck: [
      { component: 'Display', status: 'pass' },
      { component: 'Touch', status: 'pass' },
      { component: 'Camera', status: 'pass' },
      { component: 'Speaker', status: 'pass' },
      { component: 'Microphone', status: 'pass' },
      { component: 'Charging', status: 'pass' },
      { component: 'Buttons', status: 'pass' },
      { component: 'Network/SIM', status: 'pass' },
      { component: 'Wi-Fi/Bluetooth', status: 'pass' },
      { component: 'Battery', status: 'issue' },
    ],
    diagnosis: {
      problems: ['Battery degradation'],
      rootCause: 'Battery health degraded to 62%',
      observations: 'Battery cycles: 847, health: 62%, phone heats during charging',
      result: 'Battery replacement required'
    },
    repairActions: [
      { action: 'Battery replacement', selected: true },
      { action: 'Charging-port repair', selected: false },
      { action: 'Software reset', selected: false },
    ],
    partsRequested: [
      {
        id: 'pr1',
        partId: 'i5',
        partName: 'iPhone 13 Battery',
        compatibleModel: 'Galaxy A54',
        availableQuantity: 2,
        rack: 'R-04',
        box: 'B-04',
        quantityRequired: 1,
        status: 'requested'
      }
    ],
    timeline: [
      { id: 't6', status: 'received', message: 'Device received', user: 'Admin', timestamp: '2026-09-04T09:00:00', isCustomerVisible: true },
      { id: 't7', status: 'diagnosing', message: 'Battery health check - degraded to 62%', user: 'Ravi Kumar', timestamp: '2026-09-04T15:00:00', isCustomerVisible: true },
      { id: 't8', status: 'estimate_generated', message: 'Estimate: ₹2,200 for battery replacement', user: 'Ravi Kumar', timestamp: '2026-09-05T10:00:00', isCustomerVisible: true },
      { id: 't9', status: 'approved', message: 'Customer approved', user: 'Admin', timestamp: '2026-09-05T18:00:00', isCustomerVisible: true },
      { id: 't10', status: 'waiting_parts', message: 'Battery part ordered from supplier - expected in 2 days', user: 'Ravi Kumar', timestamp: '2026-09-06T16:30:00', isCustomerVisible: true },
    ]
  },
  {
    id: 'r3', repairNumber: 'RPR-2026-0044', trackingToken: 'trk_e5f6g7h8',
    customerId: 'c5', customerName: 'Sneha Reddy', customerPhone: '+91 54321 09876',
    deviceName: 'iPhone 12', deviceBrand: 'Apple', deviceModel: 'iPhone 12',
    problem: 'Back glass cracked, camera lens scratched', priority: 'low',
    status: 'estimate_generated', estimate: 3500,
    createdAt: '2026-09-05T11:30:00', updatedAt: '2026-09-06T10:00:00',
    timeline: [
      { id: 't11', status: 'received', message: 'Device received at counter', user: 'Admin', timestamp: '2026-09-05T11:30:00', isCustomerVisible: true },
      { id: 't12', status: 'diagnosing', message: 'Inspecting back glass and camera damage', user: 'Vikram Singh', timestamp: '2026-09-05T16:00:00', isCustomerVisible: true },
      { id: 't13', status: 'estimate_generated', message: 'Estimate: ₹3,500 for back glass and camera lens replacement', user: 'Vikram Singh', timestamp: '2026-09-06T10:00:00', isCustomerVisible: true },
    ]
  },
  {
    id: 'r4', repairNumber: 'RPR-2026-0045', trackingToken: 'trk_i9j0k1l2',
    customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210',
    deviceName: 'Realme Narzo 50', deviceBrand: 'Realme', deviceModel: 'Narzo 50',
    problem: 'Charging port loose, not charging properly', priority: 'medium',
    status: 'quality_check', estimate: 1500, assignedTo: 'tech1', assignedToName: 'Vikram Singh',
    createdAt: '2026-09-02T08:00:00', updatedAt: '2026-09-06T17:00:00',
    timeline: [
      { id: 't14', status: 'received', message: 'Device received', user: 'Admin', timestamp: '2026-09-02T08:00:00', isCustomerVisible: true },
      { id: 't15', status: 'diagnosing', message: 'Charging port flex cable damaged', user: 'Vikram Singh', timestamp: '2026-09-02T12:00:00', isCustomerVisible: true },
      { id: 't16', status: 'estimate_generated', message: 'Estimate: ₹1,500', user: 'Vikram Singh', timestamp: '2026-09-03T09:00:00', isCustomerVisible: true },
      { id: 't17', status: 'approved', message: 'Customer approved', user: 'Admin', timestamp: '2026-09-03T14:00:00', isCustomerVisible: true },
      { id: 't18', status: 'working', message: 'Replacing charging port', user: 'Vikram Singh', timestamp: '2026-09-04T10:00:00', isCustomerVisible: false },
      { id: 't19', status: 'quality_check', message: 'Repair complete, running quality checks', user: 'Vikram Singh', timestamp: '2026-09-06T17:00:00', isCustomerVisible: true },
    ]
  },
  {
    id: 'r5', repairNumber: 'RPR-2026-0046', trackingToken: 'trk_m3n4o5p6',
    customerId: 'c2', customerName: 'Priya Sharma', customerPhone: '+91 87654 32109',
    deviceName: 'iPhone 11', deviceBrand: 'Apple', deviceModel: 'iPhone 11',
    problem: 'Speaker not working during calls', priority: 'urgent',
    status: 'ready_pickup', estimate: 1800, assignedTo: 'tech2', assignedToName: 'Ravi Kumar',
    createdAt: '2026-09-01T14:00:00', updatedAt: '2026-09-06T11:00:00',
    timeline: [
      { id: 't20', status: 'received', message: 'Device received', user: 'Admin', timestamp: '2026-09-01T14:00:00', isCustomerVisible: true },
      { id: 't21', status: 'diagnosing', message: 'Earpiece speaker module failure', user: 'Ravi Kumar', timestamp: '2026-09-01T17:00:00', isCustomerVisible: true },
      { id: 't22', status: 'estimate_generated', message: 'Estimate: ₹1,800', user: 'Ravi Kumar', timestamp: '2026-09-02T10:00:00', isCustomerVisible: true },
      { id: 't23', status: 'approved', message: 'Customer approved', user: 'Admin', timestamp: '2026-09-02T16:00:00', isCustomerVisible: true },
      { id: 't24', status: 'working', message: 'Replacing earpiece speaker', user: 'Ravi Kumar', timestamp: '2026-09-03T09:00:00', isCustomerVisible: false },
      { id: 't25', status: 'quality_check', message: 'All tests passed', user: 'Ravi Kumar', timestamp: '2026-09-05T14:00:00', isCustomerVisible: true },
      { id: 't26', status: 'ready_pickup', message: 'Device ready for pickup', user: 'Admin', timestamp: '2026-09-06T11:00:00', isCustomerVisible: true },
    ]
  },
];

export const sales: Sale[] = [
  { id: 'sale1', invoiceNumber: 'INV-2026-0156', customerId: 'c3', customerName: 'Mobile World Store', items: [{ inventoryId: 'i8', name: 'Xiaomi Redmi Note 12', quantity: 1, unitPrice: 10500, total: 10500 }], subtotal: 10500, discount: 500, taxableAmount: 10000, cgst: 900, sgst: 900, igst: 0, totalAmount: 11800, paymentMethod: 'bank_transfer', createdAt: '2026-09-05T15:30:00' },
  { id: 'sale2', invoiceNumber: 'INV-2026-0157', customerId: 'c1', customerName: 'Rajesh Kumar', items: [{ inventoryId: 'i3', name: 'Type-C Fast Charger', quantity: 2, unitPrice: 499, total: 998 }], subtotal: 998, discount: 0, taxableAmount: 998, cgst: 89.82, sgst: 89.82, igst: 0, totalAmount: 1177.64, paymentMethod: 'upi', createdAt: '2026-09-06T10:15:00' },
  { id: 'sale3', invoiceNumber: 'INV-2026-0158', customerId: 'c6', customerName: 'TechFix Solutions', items: [{ inventoryId: 'i9', name: 'Screen Protector (Universal)', quantity: 10, unitPrice: 99, total: 990 }, { inventoryId: 'i7', name: 'USB-C Cable (1m)', quantity: 5, unitPrice: 199, total: 995 }], subtotal: 1985, discount: 185, taxableAmount: 1800, cgst: 162, sgst: 162, igst: 0, totalAmount: 2124, paymentMethod: 'bank_transfer', createdAt: '2026-09-06T14:45:00' },
];

export const scrapCategories: ScrapCategory[] = [
  { id: 'cat1', name: 'Dead Motherboard', description: 'Motherboard completely non-functional', createdAt: '2026-01-01', isDefault: true },
  { id: 'cat2', name: 'Damaged Display', description: 'Cracked or non-functional display', createdAt: '2026-01-01', isDefault: true },
  { id: 'cat3', name: 'Water Damaged', description: 'Devices damaged by water exposure', createdAt: '2026-01-01', isDefault: true },
  { id: 'cat4', name: 'Broken Frame', description: 'Physical frame damage beyond repair', createdAt: '2026-01-01', isDefault: true },
  { id: 'cat5', name: 'Non-Repairable', description: 'Devices that cannot be economically repaired', createdAt: '2026-01-01', isDefault: true },
  { id: 'cat6', name: 'E-Waste', description: 'Electronic waste for recycling', createdAt: '2026-01-01', isDefault: true },
];

export const scrapRecords: ScrapRecord[] = [
  { id: 'sc1', itemName: 'Samsung Galaxy J7', categoryId: 'cat1', category: 'Dead Motherboard', quantity: 1, reason: 'Motherboard dead, uneconomical to repair', recoveryValue: 350, createdAt: '2026-09-01' },
  { id: 'sc2', itemName: 'iPhone 8 Display', categoryId: 'cat2', category: 'Damaged Display', quantity: 2, reason: 'Too damaged for resale', recoveryValue: 200, createdAt: '2026-09-03' },
  { id: 'sc3', itemName: 'Packaging Boxes', categoryId: 'cat6', category: 'E-Waste', quantity: 15, reason: 'Water damage in storage', recoveryValue: 50, createdAt: '2026-09-05' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Low Stock Alert', message: 'iPhone 13 Battery is below minimum stock (2 remaining, min: 3)', type: 'warning', read: false, createdAt: '2026-09-06T16:00:00' },
  { id: 'n2', title: 'Low Stock Alert', message: 'USB-C Cable (1m) is below minimum stock (8 remaining, min: 15)', type: 'warning', read: false, createdAt: '2026-09-06T16:00:00' },
  { id: 'n3', title: 'Repair Ready', message: 'RPR-2026-0045 (iPhone 11) is ready for pickup', type: 'success', read: false, createdAt: '2026-09-06T11:00:00' },
  { id: 'n4', title: 'New Repair Job', message: 'RPR-2026-0044 created for Sneha Reddy - iPhone 12', type: 'info', read: true, createdAt: '2026-09-05T11:30:00' },
  { id: 'n5', title: 'Sale Completed', message: 'INV-2026-0158 - ₹2,124 from TechFix Solutions', type: 'success', read: true, createdAt: '2026-09-06T14:45:00' },
];

export const technicians = [
  { id: 'tech1', name: 'Vikram Singh', role: 'technician', assignedJobs: 2, completedToday: 3 },
  { id: 'tech2', name: 'Ravi Kumar', role: 'technician', assignedJobs: 2, completedToday: 1 },
];
