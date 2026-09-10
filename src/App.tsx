import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { RepairJobs } from './pages/RepairJobs';
import { Sales } from './pages/Sales';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { TechnicianFloor } from './pages/TechnicianFloor';
import { ScrapReturns } from './pages/ScrapReturns';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';
import { Toast } from './components/Toast';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const store = useStore();

  return (
    <HashRouter>
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <Routes>
          <Route path="/" element={<Dashboard store={store} />} />
          <Route path="/inventory" element={<Inventory store={store} />} />
          <Route path="/repairs" element={<RepairJobs store={store} />} />
          <Route path="/technician" element={<TechnicianFloor store={store} />} />
          <Route path="/sales" element={<Sales store={store} />} />
          <Route path="/customers" element={<Customers store={store} />} />
          <Route path="/suppliers" element={<Suppliers store={store} />} />
          <Route path="/scrap" element={<ScrapReturns store={store} />} />
          <Route path="/reports" element={<Reports store={store} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      {store.toast && <Toast message={store.toast.message} type={store.toast.type} />}
    </HashRouter>
  );
}
