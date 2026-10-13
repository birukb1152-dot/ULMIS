import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, Map, FileText, AlertTriangle,
  ClipboardList, Users, BarChart2, Settings, LogOut, Building2, Mail
} from 'lucide-react'

const citizenLinks = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map',           icon: Map,             label: 'Map View' },
  { to: '/land-requests', icon: FileText,         label: 'Land Requests' },
  { to: '/infra-reports', icon: AlertTriangle,    label: 'Infra Reports' },
  { to: '/reports',       icon: BarChart2,        label: 'Reports' },
  { to: '/settings',      icon: Settings,         label: 'Settings' },
]

const officerLinks = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map',              icon: Map,             label: 'Map View' },
  { to: '/officer/land',     icon: ClipboardList,   label: 'Land Applications' },
  { to: '/officer/infra',    icon: AlertTriangle,   label: 'Infra Reports' },
  { to: '/officer/users',    icon: Users,           label: 'Users & Officers' },
  { to: '/officer/messages', icon: Mail,            label: 'Contact Messages' },
  { to: '/reports',          icon: BarChart2,       label: 'Reports' },
  { to: '/settings',         icon: Settings,        label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const { currentUser, logout, darkMode } = useApp()
  const navigate = useNavigate()
  const links = currentUser?.role === 'officer' ? officerLinks : citizenLinks

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        w-60 transition-all duration-300
        ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r shadow-xl
      `}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className={`font-bold text-sm leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Urban Land</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Management System</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            currentUser?.role === 'officer'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {currentUser?.role === 'officer' ? '🏛 Municipality Officer' : '👤 Citizen'}
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : darkMode 
                    ? 'text-gray-400 hover:bg-slate-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className={`px-3 py-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-emerald-500/30">
              {currentUser?.avatar}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser?.fullName}</p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              darkMode 
                ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-400' 
                : 'text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
