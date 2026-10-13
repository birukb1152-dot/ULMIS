import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const {
    currentUser,
    darkMode,
    setDarkMode,
    visibleNotifications,
    markAllRead,
    markNotificationRead,
    logout,
  } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unread = visibleNotifications?.filter((n) => !n.read).length || 0;

  const getTimeLabel = (timestamp) => {
    if (!timestamp) return 'just now'
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const openNotification = (notification) => {
    markNotificationRead(notification.id)
    setActiveNotification(notification)
    setShowNotif(false)  // Close dropdown
    setTimeout(() => {
      setShowNotifModal(true)  // Open modal after dropdown closes
    }, 100)
  }

  const grouped = (visibleNotifications || []).reduce((groups, notification) => {
    const type = notification.type || 'Other'
    groups[type] = groups[type] || []
    groups[type].push(notification)
    return groups
  }, {})

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`
      fixed top-0 left-0 lg:left-60 right-0 h-15 z-40 flex items-center px-4 lg:px-6 gap-4 transition-all duration-300
      ${darkMode ? 'bg-slate-900/95 border-slate-700 text-white backdrop-blur-lg' : 'bg-white/95 border-gray-200 text-gray-800 backdrop-blur-lg'}
      border-b shadow-lg
    `}
      style={{ height: 60 }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className={`lg:hidden p-2 rounded-xl transition-all ${
          darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
        }`}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className={`flex-1 max-w-md relative`}>
        <Search
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search land ID, location..."
          className={`
            w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
            ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:bg-slate-700"
                : "bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white"
            }
            border focus:ring-2 focus:ring-emerald-500/20
          `}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-all ${
            darkMode 
              ? 'hover:bg-slate-800 text-yellow-400 hover:text-yellow-300' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className={`relative p-2.5 rounded-xl transition-all ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            }`}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/50">
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className={`
              absolute right-0 top-16 w-80 rounded-2xl shadow-xl border z-50 modal-enter
              ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}
            `}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 dark:border-slate-700">
                <span className="font-semibold text-sm">Notifications</span>
                <button
                  onClick={markAllRead}
                  className="text-xs text-green-500 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {visibleNotifications.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-sm">
                    No notifications
                  </p>
                ) : (
                  Object.entries(grouped).map(([type, items]) => (
                    <div key={type} className="border-b last:border-0 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                        {type}
                      </p>
                      {items.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => openNotification(n)}
                          className={`w-full text-left rounded-2xl mb-2 p-3 border ${darkMode ? "border-slate-700" : "border-gray-100"} ${!n.read ? (darkMode ? "bg-green-500/10" : "bg-green-50") : "hover:bg-slate-800 dark:hover:bg-slate-800"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className={`block text-sm ${!n.read ? "font-semibold text-white" : "text-gray-500"}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400">
                              {getTimeLabel(n.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">{n.message}</p>
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {activeNotification && showNotifModal && (
          <div className="fixed inset-0 z-[60] flex items-start justify-end pt-20 pr-6">
            <div 
              className="absolute inset-0 bg-black/20" 
              onClick={() => setShowNotifModal(false)}
            />
            <div 
              className={`relative w-96 rounded-2xl shadow-2xl border modal-enter ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                darkMode ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <h2 className="text-lg font-bold">{activeNotification.title}</h2>
                <button 
                  onClick={() => setShowNotifModal(false)} 
                  className={`p-1.5 rounded-xl ${
                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800/80' : 'bg-gray-50'} rounded-2xl p-4`}>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-2">
                      {activeNotification.type}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activeNotification.message}
                    </p>
                    {activeNotification.details && (
                      <p className="text-xs text-gray-400 mt-3">{activeNotification.details}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Received {getTimeLabel(activeNotification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
              {currentUser?.avatar}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {currentUser?.fullName?.split(" ")[0]}
            </span>
            <ChevronDown size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>

          {showProfile && (
            <div
              className={`
              absolute right-0 top-16 w-52 rounded-2xl shadow-xl border z-50 modal-enter
              ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}
            `}
            >
              <div className="px-4 py-3 border-b border-slate-700 dark:border-slate-700">
                <p className="font-semibold text-sm">{currentUser?.fullName}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfile(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                >
                  <Settings size={15} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
