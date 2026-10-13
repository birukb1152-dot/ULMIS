import { useApp } from '../../context/AppContext'

const COLORS = {
  green:  { 
    bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',  
    icon: 'text-emerald-500',  
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  blue:   { 
    bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',   
    icon: 'text-blue-500',   
    border: 'border-blue-500/20',
    shadow: 'shadow-blue-500/10'
  },
  yellow: { 
    bg: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5', 
    icon: 'text-yellow-500', 
    border: 'border-yellow-500/20',
    shadow: 'shadow-yellow-500/10'
  },
  red:    { 
    bg: 'bg-gradient-to-br from-red-500/10 to-red-600/5',    
    icon: 'text-red-500',    
    border: 'border-red-500/20',
    shadow: 'shadow-red-500/10'
  },
  purple: { 
    bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5', 
    icon: 'text-purple-500', 
    border: 'border-purple-500/20',
    shadow: 'shadow-purple-500/10'
  },
}

export default function KpiCard({ icon: Icon, label, value, color = 'green', sub }) {
  const { darkMode } = useApp()
  const c = COLORS[color] || COLORS.green
  return (
    <div className={`group card-hover rounded-2xl p-6 border shadow-lg transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 hover:shadow-xl' 
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-4xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {sub && <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{sub}</p>}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.border} border flex items-center justify-center flex-shrink-0 shadow-lg ${c.shadow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={c.icon} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )
}
