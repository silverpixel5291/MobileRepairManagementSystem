import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, Users, ShoppingCart,
  Store, Trash2, BarChart3, Settings, Bell, Search,
  QrCode, Menu, X, Plus, Zap, User
} from 'lucide-react';
import { notifications } from '../data/mockData';

interface LayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/repairs', label: 'Repair Jobs', icon: Wrench },
  { path: '/technician', label: 'Technician Floor', icon: Zap },
  { path: '/sales', label: 'Sales', icon: ShoppingCart },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/suppliers', label: 'Suppliers', icon: Store },
  { path: '/scrap', label: 'Scrap & Returns', icon: Trash2 },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Layout({ children, sidebarOpen, setSidebarOpen }: LayoutProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-navy-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-navy-900 text-white fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-700">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
            <Wrench size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">RepairOS</h1>
            <p className="text-xs text-navy-300">Smart Repair Solution</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-navy-400">admin@repairshop.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-900 text-white flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
                  <Wrench size={20} className="text-white" />
                </div>
                <h1 className="text-lg font-bold">RepairOS</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-navy-800 rounded">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-navy-100 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-navy-50 rounded-lg"
              >
                <Menu size={20} className="text-navy-700" />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-2 w-64 lg:w-80">
                <Search size={16} className="text-navy-400" />
                <input
                  type="text"
                  placeholder="Search items, customers, repairs..."
                  className="bg-transparent border-none outline-none text-sm text-navy-700 placeholder-navy-400 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm">
                <QrCode size={16} />
                <span className="hidden md:inline">Scan QR</span>
              </button>
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-mint-500 text-white rounded-lg text-sm font-medium hover:bg-mint-600 transition-colors shadow-sm">
                <Plus size={16} />
                <span className="hidden md:inline">Quick Sale</span>
              </button>
              <button className="relative p-2 hover:bg-navy-50 rounded-lg">
                <Bell size={20} className="text-navy-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-navy-100 ml-1">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={16} className="text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-navy-100 shadow-lg z-20">
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 5).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium ${
                    isActive ? 'text-primary-600' : 'text-navy-400'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
