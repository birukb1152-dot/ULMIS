import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const { darkMode } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main
        className="lg:ml-60 pt-[60px] min-h-screen"
        style={{ paddingTop: 60 }}
      >
        <div className="p-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
