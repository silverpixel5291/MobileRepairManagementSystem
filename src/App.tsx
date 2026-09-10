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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/repairs" element={<RepairJobs />} />
          <Route path="/technician" element={<TechnicianFloor />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/scrap" element={<ScrapReturns />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
