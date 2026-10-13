import { useApp } from '../../context/AppContext'

export default function FormField({ label, error, children, required }) {
  const { darkMode } = useApp()
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputClass = (darkMode, extra = '') =>
  `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition
   ${darkMode
     ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-green-500'
     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500'}
   focus:ring-2 focus:ring-green-500/20 ${extra}`

export function Input({ className = '', ...props }) {
  const { darkMode } = useApp()
  return <input className={inputClass(darkMode, className)} {...props} />
}

export function Select({ className = '', children, ...props }) {
  const { darkMode } = useApp()
  return (
    <select className={inputClass(darkMode, className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  const { darkMode } = useApp()
  return <textarea className={`${inputClass(darkMode, className)} resize-none`} {...props} />
}
