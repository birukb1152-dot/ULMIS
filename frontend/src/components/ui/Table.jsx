import { useApp } from '../../context/AppContext'

export function Table({ children }) {
  const { darkMode } = useApp()
  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  )
}
export function Thead({ children }) {
  const { darkMode } = useApp()
  return <thead className={darkMode ? 'bg-slate-800' : 'bg-gray-50'}>{children}</thead>
}
export function Th({ children, className = '' }) {
  const { darkMode } = useApp()
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${className}`}>
      {children}
    </th>
  )
}
export function Tbody({ children }) {
  const { darkMode } = useApp()
  return (
    <tbody className={`divide-y ${darkMode ? 'divide-slate-700 bg-slate-900/50' : 'divide-gray-100 bg-white'}`}>
      {children}
    </tbody>
  )
}
export function Tr({ children, className = '' }) {
  const { darkMode } = useApp()
  return (
    <tr className={`transition-colors ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} ${className}`}>
      {children}
    </tr>
  )
}
export function Td({ children, className = '', colSpan }) {
  const { darkMode } = useApp()
  return (
    <td colSpan={colSpan} className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} ${className}`}>
      {children}
    </td>
  )
}
