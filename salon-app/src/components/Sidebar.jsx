import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  FileText,
  Users,
  Scissors,
  Settings,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bill', icon: ReceiptText, label: 'New Bill' },
  { to: '/bills', icon: FileText, label: 'Bills' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/services', icon: Scissors, label: 'Services' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { salonName, logo } = useSettings();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3.5 left-3 z-50 lg:hidden bg-white rounded-lg p-2 shadow-card-hover text-surface-600"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64
          flex flex-col bg-white border-r border-surface-200 shadow-sidebar
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-100">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover" /> : <Sparkles size={20} className="text-white" />}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-primary-800 tracking-tight truncate">{salonName}</p>
            <p className="text-[11px] text-surface-400">Billing</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1" onClick={() => setOpen(false)}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-100'
                  : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'}`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-surface-100 text-[11px] text-surface-400">
          Orrenza Billing
        </div>
      </aside>
    </>
  );
}
