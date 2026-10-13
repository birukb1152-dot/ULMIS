import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table'
import FormField, { Input, Select } from '../../components/ui/FormField'
import { Plus, Eye, Search, FileText } from 'lucide-react'

const LAND_TYPES = ['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Mixed Use']
const PURPOSES   = ['Build family home', 'Small business', 'Farming', 'Investment', 'Industrial use', 'Other']
const INIT = {
  landType: '', size: '', location: '', purpose: '',
  applicationDate: new Date().toISOString().slice(0, 10),
}
const LIMIT = 10

export default function LandRequestsPage() {
  const { currentUser, landRequests, submitLandRequest, darkMode } = useApp()

  const [showForm, setShowForm]   = useState(false)
  const [viewItem, setViewItem]   = useState(null)
  const [form, setForm]           = useState(INIT)
  const [errors, setErrors]       = useState({})
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [page, setPage]           = useState(1)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Filter from local context
  const filtered = useMemo(() => {
    return landRequests
      .filter(r => r.citizenId === currentUser.id)
      .filter(r => filterStatus === 'All' || r.status === filterStatus)
      .filter(r => {
        const q = search.toLowerCase()
        return !q || r.id?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.landType?.toLowerCase().includes(q)
      })
  }, [landRequests, currentUser.id, filterStatus, search])

  const pages     = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const validate = () => {
    const e = {}
    if (!form.landType)        e.landType = 'Select land type'
    if (!form.size.trim())     e.size     = 'Enter size'
    if (!form.location.trim()) e.location = 'Enter location'
    if (!form.purpose)         e.purpose  = 'Select purpose'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500)) // small UX delay
    submitLandRequest(form)
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setShowForm(false); setForm(INIT) }, 1500)
  }

  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Land Requests"
        subtitle="Submit and track your land allocation applications"
        actions={<Button onClick={() => { setShowForm(true); setSuccess(false) }}><Plus size={16} /> New Request</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['All', 'Pending', 'Approved', 'Rejected'].map(s => {
          const count = s === 'All'
            ? landRequests.filter(r => r.citizenId === currentUser.id).length
            : landRequests.filter(r => r.citizenId === currentUser.id && r.status === s).length
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
              ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-500'
                         : 'bg-gray-50 border-gray-300 focus:border-green-500'}
              focus:ring-2 focus:ring-green-500/20`}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          className={`px-3 py-2 rounded-xl border text-sm outline-none
            ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'}`}
        >
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{filtered.length} total</span>
      </div>

      {/* Table */}
      <Table>
        <Thead>
          <tr>
            <Th>Request ID</Th><Th>Land Type</Th><Th>Size</Th><Th>Location</Th>
            <Th>Purpose</Th><Th>Date</Th><Th>Status</Th><Th>Land ID</Th><Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {paginated.length === 0 ? (
            <Tr><Td colSpan={9}>
              <div className="text-center py-12">
                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-medium">No land requests found</p>
                <p className="text-gray-400 text-sm mt-1">Click "New Request" to submit your first application</p>
              </div>
            </Td></Tr>
          ) : paginated.map(r => (
            <Tr key={r.id}>
              <Td><span className="font-mono text-xs font-bold text-green-500">{r.id}</span></Td>
              <Td>{r.landType}</Td>
              <Td>{r.size}</Td>
              <Td className="max-w-[140px] truncate">{r.location}</Td>
              <Td className="max-w-[120px] truncate">{r.purpose}</Td>
              <Td className="text-xs text-gray-400">{r.applicationDate}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>
                {r.landId
                  ? <span className="font-mono text-xs font-semibold text-blue-500">{r.landId}</span>
                  : <span className="text-gray-400 text-xs">—</span>}
              </Td>
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
        title="Submit Land Request"
        size="md"
      >
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <p className="font-bold text-lg text-green-600">Request Submitted!</p>
            <p className="text-gray-400 text-sm mt-1">Your land request has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Land Type" error={errors.landType} required>
                <Select value={form.landType} onChange={e => set('landType', e.target.value)}>
                  <option value="">Select type</option>
                  {LAND_TYPES.map(t => <option key={t}>{t}</option>)}
                </Select>
              </FormField>
              <FormField label="Size" error={errors.size} required>
                <Input value={form.size} onChange={e => set('size', e.target.value)} placeholder="e.g. 500 sqm" />
              </FormField>
            </div>
            <FormField label="Location" error={errors.location} required>
              <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Sub-city, City" />
            </FormField>
            <FormField label="Purpose" error={errors.purpose} required>
              <Select value={form.purpose} onChange={e => set('purpose', e.target.value)}>
                <option value="">Select purpose</option>
                {PURPOSES.map(p => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
            <FormField label="Application Date" required>
              <Input type="date" value={form.applicationDate} onChange={e => set('applicationDate', e.target.value)} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Submit Request'}
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
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Request Details" size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-green-500">{viewItem.id}</span>
              <StatusBadge status={viewItem.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Land Type',        viewItem.landType],
                ['Size',             viewItem.size],
                ['Location',         viewItem.location],
                ['Purpose',          viewItem.purpose],
                ['Application Date', viewItem.applicationDate],
                ['Last Updated',     viewItem.updatedAt],
                ['Assigned Land ID', viewItem.landId || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 font-medium">{k}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{v}</p>
                </div>
              ))}
            </div>
            {viewItem.officerNote && (
              <div className={`rounded-xl p-3 border-l-4 border-green-500 ${darkMode ? 'bg-slate-700' : 'bg-green-50'}`}>
                <p className="text-xs text-gray-400 font-medium mb-1">Officer Note</p>
                <p className="text-sm">{viewItem.officerNote}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
