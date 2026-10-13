import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table'
import FormField, { Input, Select, Textarea } from '../../components/ui/FormField'
import { Plus, Eye, Search, AlertTriangle } from 'lucide-react'

const ISSUE_TYPES = ['Road Damage', 'Water Supply', 'Street Light', 'Sewage', 'Electricity', 'Garbage', 'Flooding', 'Other']
const INIT = {
  issueType: '', location: '', description: '',
  reportDate: new Date().toISOString().slice(0, 10),
}
const LIMIT = 10

export default function InfraReportsPage() {
  const { currentUser, infraReports, submitInfraReport, addInfraComment, darkMode } = useApp()

  const [showForm, setShowForm]   = useState(false)
  const [viewItem, setViewItem]   = useState(null)
  const [form, setForm]           = useState(INIT)
  const [errors, setErrors]       = useState({})
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [page, setPage]           = useState(1)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Filter from local context
  const filtered = useMemo(() => {
    return infraReports
      .filter(r => r.citizenId === currentUser.id)
      .filter(r => filterStatus === 'All' || r.status === filterStatus)
      .filter(r => {
        const q = search.toLowerCase()
        return !q || r.id?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.issueType?.toLowerCase().includes(q)
      })
  }, [infraReports, currentUser.id, filterStatus, search])

  const pages     = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const validate = () => {
    const e = {}
    if (!form.issueType)          e.issueType   = 'Select issue type'
    if (!form.location.trim())    e.location    = 'Enter location'
    if (!form.description.trim()) e.description = 'Describe the issue'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    submitInfraReport(form)
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setShowForm(false); setForm(INIT) }, 1500)
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
        subtitle="Report and track infrastructure issues in your area"
        actions={<Button onClick={() => { setShowForm(true); setSuccess(false) }}><Plus size={16} /> Report Issue</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['All', 'Pending', 'In Progress', 'Resolved'].map(s => {
          const count = s === 'All'
            ? infraReports.filter(r => r.citizenId === currentUser.id).length
            : infraReports.filter(r => r.citizenId === currentUser.id && r.status === s).length
          return (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
              className={`${card} p-4 text-left card-hover ${filterStatus === s ? 'ring-2 ring-green-500' : ''}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{count}</p>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s}</p>
            </button>
          )
        })}
      </div>

      {/* Search + filter */}
      <div className={`${card} p-4 flex flex-wrap gap-3 items-center`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by ID, location, type..."
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
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{filtered.length} total</span>
      </div>

      {/* Table */}
      <Table>
        <Thead>
          <tr>
            <Th>Report ID</Th><Th>Issue Type</Th><Th>Location</Th>
            <Th>Description</Th><Th>Date</Th><Th>Status</Th><Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {paginated.length === 0 ? (
            <Tr><Td colSpan={7}>
              <div className="text-center py-12">
                <AlertTriangle size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-medium">No reports found</p>
                <p className="text-gray-400 text-sm mt-1">Click "Report Issue" to submit your first report</p>
              </div>
            </Td></Tr>
          ) : paginated.map(r => (
            <Tr key={r.id}>
              <Td><span className="font-mono text-xs font-bold text-blue-500">{r.id}</span></Td>
              <Td>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {r.issueType}
                </span>
              </Td>
              <Td className="max-w-[140px] truncate">{r.location}</Td>
              <Td className="max-w-[180px] truncate text-gray-400 text-xs">{r.description}</Td>
              <Td className="text-xs text-gray-400">{r.reportDate}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>
                <Button variant="ghost" size="sm" onClick={() => setViewItem(r)}>
                  <Eye size={14} /> View
                </Button>
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

      {/* Submit Modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setForm(INIT); setErrors({}) }}
        title="Report Infrastructure Issue"
        size="md"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <p className="font-bold text-lg text-green-600">Report Submitted!</p>
            <p className="text-gray-400 text-sm mt-1">Your report has been submitted and will be reviewed shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Issue Type" error={errors.issueType} required>
                <Select value={form.issueType} onChange={e => set('issueType', e.target.value)}>
                  <option value="">Select type</option>
                  {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                </Select>
              </FormField>
              <FormField label="Report Date" required>
                <Input type="date" value={form.reportDate} onChange={e => set('reportDate', e.target.value)} />
              </FormField>
            </div>
            <FormField label="Location" error={errors.location} required>
              <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Street, Sub-city, City" />
            </FormField>
            <FormField label="Description" error={errors.description} required>
              <Textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={4}
              />
            </FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Submit Report'}
              </Button>
              <Button type="button" variant="outline"
                onClick={() => { setShowForm(false); setForm(INIT); setErrors({}) }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

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
                ['Issue Type',   viewItem.issueType],
                ['Location',     viewItem.location],
                ['Report Date',  viewItem.reportDate],
                ['Last Updated', viewItem.updatedAt],
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
              <div className={`rounded-xl p-3 border-l-4 border-green-500 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className="text-xs text-gray-400 font-medium mb-1">Officer Note</p>
                <p className="text-sm">{viewItem.officerNote}</p>
              </div>
            )}

            <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">Comments</p>
                <span className="text-xs text-gray-400">{(viewItem.comments || []).length} total</span>
              </div>
              {(viewItem.comments || []).length === 0 ? (
                <p className="text-xs text-gray-400">No comments yet. Leave a note for the officers.</p>
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
                  placeholder="Leave a comment for the officer..."
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
          </div>
        )}
      </Modal>
    </div>
  )
}
