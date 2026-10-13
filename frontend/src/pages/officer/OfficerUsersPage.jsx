import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import StatusBadge from '../../components/ui/StatusBadge'
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table'
import { Eye, Search, Users, UserPlus, Trash2, ShieldCheck, ShieldOff } from 'lucide-react'

const INIT_OFFICER = {
  fullName: '', nationalId: '', phoneNumber: '', email: '', address: '', password: '',
}

export default function OfficerUsersPage() {
  const { currentUser, users, landRequests, infraReports, addOfficer, removeOfficer, darkMode } = useApp()
  const isSuperAdmin = currentUser?.isSuperAdmin || false
  
  // Debug: Log current user info
  console.log('Current User:', currentUser)
  console.log('Is Super Admin:', isSuperAdmin)

  const [tab, setTab]               = useState('citizens')   // 'citizens' | 'officers'
  const [search, setSearch]         = useState('')
  const [viewItem, setViewItem]     = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(null)   // officer to remove
  const [form, setForm]             = useState(INIT_OFFICER)
  const [formErrors, setFormErrors] = useState({})
  const [serverErr, setServerErr]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Filtered lists
  const citizens = users.filter(u => u.role === 'citizen').filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.nationalId.includes(search)
  )
  const officers = users.filter(u => u.role === 'officer').filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const getLandCount  = (uid) => landRequests.filter(r => r.citizenId === uid).length
  const getInfraCount = (uid) => infraReports.filter(r => r.citizenId === uid).length

  // ── Add officer form validation ───────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.fullName.trim())              e.fullName    = 'Required'
    if (!/^\d{8,12}$/.test(form.nationalId)) e.nationalId = '8–12 digits only'
    if (!/^\d{10}$/.test(form.phoneNumber)) e.phoneNumber = '10 digits required'
    if (!/\S+@\S+\.\S+/.test(form.email))  e.email       = 'Invalid email'
    if (!form.address.trim())              e.address     = 'Required'
    if (form.password.length < 6)          e.password    = 'Min. 6 characters'
    return e
  }

  const handleAddOfficer = async (e) => {
    e.preventDefault()
    setServerErr('')
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setFormErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = addOfficer(form)
    setLoading(false)
    if (result.success) {
      setAddSuccess(true)
      setTimeout(() => {
        setAddSuccess(false)
        setShowAddModal(false)
        setForm(INIT_OFFICER)
        setTab('officers')
      }, 1500)
    } else {
      setServerErr(result.error)
    }
  }

  const handleRemoveOfficer = () => {
    if (!confirmRemove) return
    removeOfficer(confirmRemove.id)
    setConfirmRemove(null)
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`
  const inputCls = (hasErr) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition
    ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-500'
               : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'}
    ${hasErr ? '!border-red-500' : ''}
    focus:ring-2 focus:ring-green-500/20`
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Officers"
        subtitle="Manage citizens and municipality officers"
        actions={
          isSuperAdmin && (
            <Button onClick={() => { setShowAddModal(true); setAddSuccess(false); setServerErr(''); setFormErrors({}) }}>
              <UserPlus size={16} /> Add Officer
            </Button>
          )
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Citizens', count: users.filter(u => u.role === 'citizen').length,  icon: '👤', color: 'text-green-500' },
          { label: 'Total Officers', count: users.filter(u => u.role === 'officer').length,  icon: '🏛', color: 'text-blue-500' },
          { label: 'Total Users',    count: users.length,                                    icon: '👥', color: 'text-purple-500' },
        ].map(({ label, count, icon, color }) => (
          <div key={label} className={`${card} p-4`}>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{icon} {label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className={`${card} p-4 flex flex-wrap items-center gap-3`}>
        {/* Tab switcher */}
        <div className={`flex rounded-xl p-1 gap-1 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setTab('citizens')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === 'citizens'
                ? 'bg-green-500 text-white shadow-sm'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            👤 Citizens ({citizens.length})
          </button>
          <button
            onClick={() => setTab('officers')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === 'officers'
                ? 'bg-blue-500 text-white shadow-sm'
                : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🏛 Officers ({officers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'citizens' ? 'Search citizens...' : 'Search officers...'}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition
              ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-green-500'
                         : 'bg-gray-50 border-gray-300 focus:border-green-500'}
              focus:ring-2 focus:ring-green-500/20`}
          />
        </div>
      </div>

      {/* ── Citizens Table ── */}
      {tab === 'citizens' && (
        <Table>
          <Thead>
            <tr>
              <Th>Citizen</Th><Th>National ID</Th><Th>Phone</Th>
              <Th>Email</Th><Th>Address</Th><Th>Lands</Th><Th>Reports</Th>
              <Th>Joined</Th><Th>Actions</Th>
            </tr>
          </Thead>
          <Tbody>
            {citizens.length === 0 ? (
              <Tr><Td colSpan={9}>
                <div className="text-center py-12">
                  <Users size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400">No citizens found</p>
                </div>
              </Td></Tr>
            ) : citizens.map(u => (
              <Tr key={u.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.fullName.slice(0,2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{u.fullName}</span>
                  </div>
                </Td>
                <Td className="font-mono text-xs">{u.nationalId}</Td>
                <Td className="text-sm">{u.phoneNumber}</Td>
                <Td className="text-sm text-gray-400 max-w-[150px] truncate">{u.email}</Td>
                <Td className="text-sm max-w-[130px] truncate">{u.address}</Td>
                <Td><span className="font-bold text-green-500">{getLandCount(u.id)}</span></Td>
                <Td><span className="font-bold text-blue-500">{getInfraCount(u.id)}</span></Td>
                <Td className="text-xs text-gray-400">{u.createdAt}</Td>
                <Td>
                  <Button variant="ghost" size="sm" onClick={() => setViewItem(u)} title="View citizen details">
                    <Eye size={13} /> View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* ── Officers Table ── */}
      {tab === 'officers' && (
        <Table>
          <Thead>
            <tr>
              <Th>Officer</Th><Th>Email</Th><Th>Phone</Th>
              <Th>Address</Th><Th>Type</Th><Th>Joined</Th><Th>Actions</Th>
            </tr>
          </Thead>
          <Tbody>
            {officers.length === 0 ? (
              <Tr><Td colSpan={7}>
                <div className="text-center py-12">
                  <ShieldOff size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400">No officers found</p>
                </div>
              </Td></Tr>
            ) : officers.map(u => (
              <Tr key={u.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.fullName.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{u.fullName}</p>
                      <p className="text-xs text-gray-400 font-mono">{u.nationalId}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-sm text-gray-400">{u.email}</Td>
                <Td className="text-sm">{u.phoneNumber}</Td>
                <Td className="text-sm max-w-[130px] truncate">{u.address}</Td>
                <Td>
                  {u.isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                      <ShieldCheck size={11} /> Super Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                      🏛 Officer
                    </span>
                  )}
                </Td>
                <Td className="text-xs text-gray-400">{u.createdAt}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    {isSuperAdmin ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => setViewItem(u)} title="View officer details">
                          <Eye size={13} />
                        </Button>
                        {!u.isSuperAdmin && (
                          <Button
                            variant="ghost" size="sm"
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            onClick={() => setConfirmRemove(u)}
                            title="Delete officer"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Admin only</span>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* ── View Profile Modal ── */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="User Profile" size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold
                ${viewItem.role === 'officer' ? 'bg-blue-500' : 'bg-green-500'}`}>
                {viewItem.fullName.slice(0,2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewItem.fullName}</h3>
                <p className="text-gray-400 text-sm">{viewItem.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {viewItem.isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                      <ShieldCheck size={11} /> Super Admin
                    </span>
                  ) : viewItem.role === 'officer' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                      🏛 Municipality Officer
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                      👤 Citizen
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['National ID', viewItem.nationalId],
                ['Phone',       viewItem.phoneNumber],
                ['Address',     viewItem.address],
                ['Joined',      viewItem.createdAt],
                ...(viewItem.role === 'citizen' ? [
                  ['Land Requests',  getLandCount(viewItem.id)],
                  ['Infra Reports',  getInfraCount(viewItem.id)],
                ] : []),
              ].map(([k, v]) => (
                <div key={k} className={`rounded-xl p-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-400 font-medium">{k}</p>
                  <p className="text-sm font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Officer Modal ── */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setForm(INIT_OFFICER); setFormErrors({}); setServerErr('') }}
        title="Add New Officer"
        size="md"
      >
        {addSuccess ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-blue-500" />
            </div>
            <p className="font-bold text-lg text-blue-500">Officer Added!</p>
            <p className="text-gray-400 text-sm mt-1">The new officer account has been created.</p>
          </div>
        ) : (
          <form onSubmit={handleAddOfficer} className="space-y-4" noValidate>
            {/* Info banner */}
            <div className={`flex items-start gap-3 p-3 rounded-xl text-sm ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
              <ShieldCheck size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className={darkMode ? 'text-blue-300' : 'text-blue-700'}>
                Officer accounts are created internally. They will be able to manage land applications and infrastructure reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder="Officer full name"
                  className={inputCls(!!formErrors.fullName)} />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>

              {/* National ID */}
              <div>
                <label className={labelCls}>National ID <span className="text-red-500">*</span></label>
                <input type="text" inputMode="numeric" pattern="\d*"
                  value={form.nationalId}
                  onChange={e => set('nationalId', e.target.value.replace(/\D/g, ''))}
                  placeholder="8–12 digits" maxLength={12}
                  className={inputCls(!!formErrors.nationalId)} />
                {formErrors.nationalId && <p className="text-red-500 text-xs mt-1">{formErrors.nationalId}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phoneNumber}
                  onChange={e => set('phoneNumber', e.target.value)}
                  placeholder="0911000000"
                  className={inputCls(!!formErrors.phoneNumber)} />
                {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="officer@gov.et"
                  className={inputCls(!!formErrors.email)} />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>Address <span className="text-red-500">*</span></label>
              <input type="text" value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="Sub-city, City"
                className={inputCls(!!formErrors.address)} />
              {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Temporary Password <span className="text-red-500">*</span></label>
              <input type="text" value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Min. 6 characters"
                className={inputCls(!!formErrors.password)} />
              {formErrors.password
                ? <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                : <p className="text-gray-400 text-xs mt-1">Share this with the officer so they can log in</p>
              }
            </div>

            {serverErr && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {serverErr}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><ShieldCheck size={15} /> Create Officer Account</>
                }
              </Button>
              <Button type="button" variant="outline"
                onClick={() => { setShowAddModal(false); setForm(INIT_OFFICER); setFormErrors({}); setServerErr('') }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Confirm Remove Modal ── */}
      <Modal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        title="Remove Officer"
        size="sm"
      >
        {confirmRemove && (
          <div className="space-y-4">
            <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {confirmRemove.fullName.slice(0,2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{confirmRemove.fullName}</p>
                <p className="text-sm text-gray-400">{confirmRemove.email}</p>
              </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to remove this officer? They will lose access to the system immediately.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleRemoveOfficer}>
                <Trash2 size={15} /> Yes, Remove
              </Button>
              <Button variant="outline" onClick={() => setConfirmRemove(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
