import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table'
import FormField, { Input, Textarea } from '../../components/ui/FormField'
import { Eye, CheckCircle, XCircle, Search, ClipboardList } from 'lucide-react'

const LIMIT = 10

export default function OfficerLandPage() {
  const { landRequests, updateLandRequest, users, darkMode } = useApp()

  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [page, setPage]                 = useState(1)
  const [viewItem, setViewItem]         = useState(null)
  const [actionItem, setActionItem]     = useState(null)
  const [actionType, setActionType]     = useState('')
  const [landId, setLandId]             = useState('')
  const [note, setNote]                 = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [success, setSuccess]           = useState(false)

  // Enrich each request with citizen name from users list
  const enriched = useMemo(() => {
    return landRequests.map(r => ({
      ...r,
      citizenName: r.citizenName ||
        users.find(u => u.id === r.citizenId)?.fullName || '—',
    }))
  }, [landRequests, users])

  const filtered = useMemo(() => {
    return enriched
      .filter(r => filterStatus === 'All' || r.status === filterStatus)
      .filter(r => {
        const q = search.toLowerCase()
        return !q ||
          r.id?.toLowerCase().includes(q) ||
          r.citizenName?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q) ||
          r.landType?.toLowerCase().includes(q)
      })
  }, [enriched, filterStatus, search])

  const pages     = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const openAction = (item, type) => {
    setActionItem(item)
    setActionType(type)
    setLandId(item.landId || `LAND-AA-${Math.floor(Math.random() * 900) + 100}`)
    setNote(item.officerNote || '')
    setSuccess(false)
  }

  const handleAction = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    const status = actionType === 'approve' ? 'Approved' : 'Rejected'
    updateLandRequest(actionItem.id, {
      status,
      landId: actionType === 'approve' ? landId : actionItem.landId,
      officerNote: note,
    })
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setActionItem(null); setSuccess(false) }, 1500)
  }

  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`

  return (
    <div className="space-y-6">
      <PageHeader
        title="Land Applications"
        subtitle="Review, approve, or reject citizen land requests"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',        status: 'All',          color: 'text-gray-600 dark:text-gray-300' },
          { label: 'Pending',      status: 'Pending',      color: 'text-yellow-500' },
          { label: 'Approved',     status: 'Approved',     color: 'text-green-500' },
          { label: 'Rejected',     status: 'Rejected',     color: 'text-red-500' },
        ].map(({ label, status, color }) => (
          <button key={status} onClick={() => { setFilterStatus(status); setPage(1) }}
            className={`${card} p-4 text-left card-hover ${filterStatus === status ? 'ring-2 ring-green-500' : ''}`}>
            <p className={`text-2xl font-bold ${color}`}>
              {status === 'All' ? landRequests.length : landRequests.filter(r => r.status === status).length}
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
            placeholder="Search by ID, citizen, location..."
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
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filtered.length} total
        </span>
      </div>

      {/* Table */}
      <Table>
        <Thead>
          <tr>
            <Th>Request ID</Th><Th>Citizen</Th><Th>Land Type</Th><Th>Size</Th>
            <Th>Location</Th><Th>Date</Th><Th>Status</Th><Th>Land ID</Th><Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {paginated.length === 0 ? (
            <Tr><Td colSpan={9}>
              <div className="text-center py-12">
                <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400">No applications found</p>
              </div>
            </Td></Tr>
          ) : paginated.map(r => (
            <Tr key={r.id}>
              <Td><span className="font-mono text-xs font-bold text-green-500">{r.id}</span></Td>
              <Td className="font-medium">{r.citizenName}</Td>
              <Td>{r.landType}</Td>
              <Td>{r.size}</Td>
              <Td className="max-w-[130px] truncate">{r.location}</Td>
              <Td className="text-xs text-gray-400">{r.applicationDate}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>
                {r.landId
                  ? <span className="font-mono text-xs font-semibold text-blue-500">{r.landId}</span>
                  : <span className="text-gray-400 text-xs">—</span>}
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setViewItem(r)} title="View application details">
                    <Eye size={13} />
                  </Button>
                  {(r.status === 'Pending' || r.status === 'Under Review') && <>
                    <Button variant="ghost" size="sm"
                      className="text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10"
                      onClick={() => openAction(r, 'approve')}
                      title="Approve application">
                      <CheckCircle size={13} />
                    </Button>
                    <Button variant="ghost" size="sm"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      onClick={() => openAction(r, 'reject')}
                      title="Reject application">
                      <XCircle size={13} />
                    </Button>
                  </>}
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
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Application Details" size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-green-500">{viewItem.id}</span>
              <StatusBadge status={viewItem.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Citizen',    viewItem.citizenName],
                ['Land Type',  viewItem.landType],
                ['Size',       viewItem.size],
                ['Location',   viewItem.location],
                ['Purpose',    viewItem.purpose],
                ['Date',       viewItem.applicationDate],
                ['Land ID',    viewItem.landId || '—'],
                ['Updated',    viewItem.updatedAt],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 font-medium">{k}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{v}</p>
                </div>
              ))}
            </div>
            {viewItem.officerNote && (
              <div className={`rounded-xl p-3 border-l-4 border-green-500 ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className="text-xs text-gray-400 font-medium mb-1">Officer Note</p>
                <p className="text-sm">{viewItem.officerNote}</p>
              </div>
            )}
            {(viewItem.status === 'Pending' || viewItem.status === 'Under Review') && (
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => { setViewItem(null); openAction(viewItem, 'approve') }}>
                  <CheckCircle size={15} /> Approve
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => { setViewItem(null); openAction(viewItem, 'reject') }}>
                  <XCircle size={15} /> Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve / Reject Modal */}
      <Modal
        open={!!actionItem}
        onClose={() => setActionItem(null)}
        title={actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
        size="sm"
      >
        {success ? (
          <div className="text-center py-8">
            <span className="text-4xl">{actionType === 'approve' ? '✅' : '❌'}</span>
            <p className="font-bold text-lg mt-3">
              {actionType === 'approve' ? 'Application Approved!' : 'Application Rejected'}
            </p>
          </div>
        ) : actionItem && (
          <div className="space-y-4">
            <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm font-medium">{actionItem.id} — {actionItem.citizenName}</p>
              <p className="text-xs text-gray-400">{actionItem.location} · {actionItem.landType}</p>
            </div>
            {actionType === 'approve' && (
              <FormField label="Assign Land ID" required>
                <Input
                  value={landId}
                  onChange={e => setLandId(e.target.value)}
                  placeholder="LAND-AA-XXX"
                />
              </FormField>
            )}
            <FormField label="Officer Note">
              <Textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={actionType === 'approve' ? 'Approval notes...' : 'Reason for rejection...'}
                rows={3}
              />
            </FormField>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant={actionType === 'approve' ? 'primary' : 'danger'}
                onClick={handleAction}
                disabled={submitting}
              >
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'
                }
              </Button>
              <Button variant="outline" onClick={() => setActionItem(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
