const STATUS_STYLES = {
  Pending:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  'Under Review':'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  Approved:     'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Rejected:     'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  'In Progress':'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  Resolved:     'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
