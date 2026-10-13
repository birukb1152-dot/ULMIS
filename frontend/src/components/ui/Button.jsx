export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-500/25 active:scale-95',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-200',
    danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/25 active:scale-95',
    outline:   'border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200',
    ghost:     'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
