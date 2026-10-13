import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const { darkMode } = useApp()
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} rounded-2xl shadow-2xl modal-enter ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className={`p-1.5 rounded-xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
