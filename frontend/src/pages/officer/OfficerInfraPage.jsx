import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table'
import FormField, { Select, Textarea } from '../../components/ui/FormField'
import { Eye, Wrench, Search, AlertTriangle } from 'lucide-react'

const LIMIT = 10

export default function OfficerInfraPage() {
  const { infraReports, updateInfraReport, addInfraComment, users, darkMode } = useApp()

  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [page, setPage]                 = useState(1)
  const [viewItem, setViewItem]         = useState(null)
  const [updateItem, setUpdateItem]     = useState(null)
  const [newStatus, setNewStatus]       = useState('')
  const [note, setNote]                 = useState('')
  const [commentText, setCommentText]   = useState('')
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [success, setSuccess]           = useState(false)

  // Enrich with citizen name
  const enriched = useMemo(() => {
    return infraReports.map(r => ({
      ...r,
      citizenName: r.citizenName ||
        users.find(u => u.id === r.citizenId)?.fullName || '—',
    }))
  }, [infraReports, users])

  const filtered = useMemo(() => {
    return enriched
      .filter(r => filterStatus === 'All' || r.status === filterStatus)
      .filter(r => {
        const q = search.toLowerCase()
        return !q ||
          r.id?.toLowerCase().includes(q) ||
          r.citizenName?.toLowerCase().includes(q) ||
          r.issueType?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q)
      })
  }, [enriched, filterStatus, search])

  const pages     = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const openUpdate = (item) => {
    setUpdateItem(item)
    setNewStatus(item.status)
    setNote(item.officerNote || '')
    setSuccess(false)
  }

  const handleUpdate = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    updateInfraReport(updateItem.id, { status: newStatus, officerNote: note })
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setUpdateItem(null); setSuccess(false) }, 1500)
  }

  const handleComment = async () => {
    if (!commentText.trim() || !viewItem) return
    setCommentSuccess(false)
    const newComment = addInfraComment(viewItem.id, commentText.trim())
    setCommentText('')
    setCommentSuccess(true)
    setViewItem(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev)
    setTimeout(() => setCommentSuccess(false), 1500)
  }

  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`

  return (
    <div className="space-y-6">
      <PageHeader
        title="Infrastructure Reports"
        subtitle="Manage and update citizen-reported infrastructure issues"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',       status: 'All',         color: 'text-gray-600 dark:text-gray-300' },
          { label: 'Pending',     status: 'Pending',     color: 'text-yellow-500' },
          { label: 'In Progress', status: 'In Progress', color: 'text-blue-500' },
          { label: 'Resolved',    status: 'Resolved',    color: 'text-green-500' },
        ].map(({ label, status, color }) => (
          <button key={status} onClick={() => { setFilterStatus(status); setPage(1) }}
            className={`${card} p-4 text-left card-hover ${filterStatus === status ? 'ring-2 ring-green-500' : ''}`}>
            <p className={`text-2xl font-bold ${color}`}>
              {status === 'All' ? infraReports.length : infraReports.filter(r => r.status === status).length}
            </p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className={`${card} p-4 flex flex-wrap gap-3 items-center`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by ID, citizen, issue type..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition
              ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                         : 'bg-gray-50 border-gray-300 focus:border-green-500'}
              focus:ring-2 focus:ring-green-500/20`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          className={`px-3 py-2 rounded-xl border text-sm outline-none
            ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}
        >
          {['All', 'Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filtered.length} total
        </span>
      </div>

      {/* Table */}
      <Table>
        <Thead>
          <tr>
            <Th>Report ID</Th><Th>Citizen</Th><Th>Issue Type</Th><Th>Location</Th>
            <Th>Description</Th><Th>Date</Th><Th>Status</Th><Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {paginated.length === 0 ? (
            <Tr><Td colSpan={8}>
              <div className="text-center py-12">
                <AlertTriangle size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400">No reports found</p>
              </div>
            </Td></Tr>
          ) : paginated.map(r => (
            <Tr key={r.id}>
              <Td><span className="font-mono text-xs font-bold text-blue-500">{r.id}</span></Td>
              <Td className="font-medium">{r.citizenName}</Td>
              <Td>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {r.issueType}
                </span>
              </Td>
              <Td className="max-w-[130px] truncate">{r.location}</Td>
              <Td className="max-w-[160px] truncate text-gray-400 text-xs">{r.description}</Td>
              <Td className="text-xs text-gray-400">{r.reportDate}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setViewItem(r)} title="View report details">
                    <Eye size={13} />
                  </Button>
                  <Button variant="ghost" size="sm"
                    className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    onClick={() => openUpdate(r)}
                    title="Update report status">
                    <Wrench size={13} />
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Report Details" size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-blue-500">{viewItem.id}</span>
              <StatusBadge status={viewItem.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Citizen',     viewItem.citizenName],
                ['Issue Type',  viewItem.issueType],
                ['Location',    viewItem.location],
                ['Report Date', viewItem.reportDate],
                ['Updated',     viewItem.updatedAt],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 font-medium">{k}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-xs text-gray-400 font-medium mb-1">Description</p>
              <p className="text-sm">{viewItem.description}</p>
            </div>
            {viewItem.officerNote && (
              <div className={`rounded-xl p-3 border-l-4 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className="text-xs text-gray-400 font-medium mb-1">Officer Note</p>
                <p className="text-sm">{viewItem.officerNote}</p>
              </div>
            )}

            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Comments</p>
                <span className="text-xs text-gray-400">{(viewItem.comments || []).length} total</span>
              </div>
              {(viewItem.comments || []).length === 0 ? (
                <p className="text-xs text-gray-400">No comments yet. Leave a note for the citizen.</p>
              ) : (
                <div className="space-y-3">
                  {(viewItem.comments || []).map((comment) => (
                    <div key={comment.id} className={`rounded-2xl p-3 ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between gap-2 text-xs text-gray-400 mb-2">
                        <span>{comment.authorName}</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm">{comment.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a comment for the citizen..."
                  rows={3}
                />
                <div className="flex items-center justify-between gap-3">
                  <Button onClick={handleComment} className="flex-1" disabled={!commentText.trim()}>
                    Comment
                  </Button>
                  {commentSuccess && (
                    <span className="text-xs text-green-500">Comment sent</span>
                  )}
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => { setViewItem(null); openUpdate(viewItem) }}>
              <Wrench size={15} /> Update Status
            </Button>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal open={!!updateItem} onClose={() => setUpdateItem(null)} title="Update Report Status" size="sm">
        {success ? (
          <div className="text-center py-8">
            <span className="text-4xl">✅</span>
            <p className="font-bold text-lg mt-3">Status Updated!</p>
          </div>
        ) : updateItem && (
          <div className="space-y-4">
            <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm font-medium">{updateItem.id} — {updateItem.issueType}</p>
              <p className="text-xs text-gray-400">{updateItem.location} · {updateItem.citizenName}</p>
            </div>
            <FormField label="New Status" required>
              <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {['Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Officer Note">
              <Textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add update notes..."
                rows={3}
              />
            </FormField>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleUpdate} disabled={submitting}>
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Update Status'
                }
              </Button>
              <Button variant="outline" onClick={() => setUpdateItem(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
