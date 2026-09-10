import { Store, FileText, Bell, Shield, Globe } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
        <p className="text-sm text-navy-500">Configure your shop and system preferences</p>
      </div>

      {/* Business Profile */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-navy-100">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Store size={20} className="text-primary-600" />
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">Business Profile</h2>
            <p className="text-xs text-navy-500">Shop name, address, and identity</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Shop Name</label>
              <input type="text" defaultValue="Mobile Repair Hub" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
              <input type="text" defaultValue="+91 98765 00000" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-700 mb-1">Address</label>
              <input type="text" defaultValue="123 Main Street, Bangalore, Karnataka 560001" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">GSTIN</label>
              <input type="text" defaultValue="29AABCM1234F1ZP" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
              <input type="text" defaultValue="info@mobilerepairhub.in" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
            Save Changes
          </button>
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-navy-100">
          <div className="w-10 h-10 rounded-lg bg-mint-100 flex items-center justify-center">
            <FileText size={20} className="text-mint-600" />
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">Invoice Settings</h2>
            <p className="text-xs text-navy-500">Invoice numbering, tax defaults, and footer</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Invoice Prefix</label>
              <input type="text" defaultValue="INV-2026-" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Default Tax Rate (%)</label>
              <input type="text" defaultValue="18" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-700 mb-1">Invoice Footer Note</label>
              <textarea defaultValue="Thank you for your business! Goods once sold cannot be taken back." rows={2} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 resize-none" />
            </div>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-navy-100">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">Notifications</h2>
            <p className="text-xs text-navy-500">Configure alerts and messaging preferences</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Low stock alerts', enabled: true },
            { label: 'New repair job notifications', enabled: true },
            { label: 'Repair status updates', enabled: true },
            { label: 'Sales completion alerts', enabled: false },
            { label: 'WhatsApp delivery confirmations', enabled: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <span className="text-sm text-navy-700">{item.label}</span>
              <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-primary-500' : 'bg-navy-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.enabled ? 'left-5' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-navy-100">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Globe size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">WhatsApp Integration</h2>
            <p className="text-xs text-navy-500">Connect WhatsApp Cloud API for automated messaging</p>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Note:</span> WhatsApp Cloud API credentials are not configured. Messages will open WhatsApp Web/App with pre-filled text.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Phone Number ID</label>
              <input type="text" placeholder="Enter Phone Number ID" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Access Token</label>
              <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100" />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
            Connect WhatsApp
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-navy-100">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
            <Shield size={20} className="text-rose-600" />
          </div>
          <div>
            <h2 className="font-semibold text-navy-900">Security & Roles</h2>
            <p className="text-xs text-navy-500">Manage staff accounts and permissions</p>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {[
              { name: 'Admin User', role: 'Admin', email: 'admin@repairshop.in' },
              { name: 'Vikram Singh', role: 'Technician', email: 'vikram@repairshop.in' },
              { name: 'Ravi Kumar', role: 'Technician', email: 'ravi@repairshop.in' },
              { name: 'Counter Staff', role: 'Counter Staff', email: 'counter@repairshop.in' },
            ].map((user, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-navy-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-800">{user.name}</p>
                  <p className="text-xs text-navy-500">{user.email}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.role === 'Admin' ? 'bg-primary-100 text-primary-700' :
                  user.role === 'Technician' ? 'bg-amber-100 text-amber-700' :
                  'bg-navy-100 text-navy-600'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200">
            Manage Staff
          </button>
        </div>
      </div>
    </div>
  );
}
