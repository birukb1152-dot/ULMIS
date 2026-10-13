import { useState } from 'react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import FormField, { Input } from '../components/ui/FormField'
import { User, Shield, Bell, Palette, Save, Check } from 'lucide-react'

export default function SettingsPage() {
  const { currentUser, setCurrentUser, users, setUsers, darkMode, setDarkMode } = useApp()

  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved]         = useState(false)

  const [profile, setProfile] = useState({
    fullName:    currentUser?.fullName    || '',
    email:       currentUser?.email       || '',
    phoneNumber: currentUser?.phoneNumber || '',
    address:     currentUser?.address     || '',
  })
  const [profileErr, setProfileErr] = useState('')

  const [notifs, setNotifs] = useState({
    emailNotifs: true, smsNotifs: false,
    landUpdates: true, infraUpdates: true, systemAlerts: true,
  })

  const [security, setSecurity] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })
  const [secErr, setSecErr] = useState('')
  const [secOk, setSecOk]   = useState(false)

  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`

  // ── Save profile — updates local context directly ─────────────────────────
  const saveProfile = () => {
    setProfileErr('')
    if (!profile.fullName.trim()) { setProfileErr('Full name is required'); return }
    if (!/\S+@\S+\.\S+/.test(profile.email)) { setProfileErr('Enter a valid email'); return }

    // Update the user in context and users array
    const updatedUser = { ...currentUser, ...profile }
    setCurrentUser(updatedUser)
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ── Change password — validates against local user record ─────────────────
  const changePassword = () => {
    setSecErr(''); setSecOk(false)
    if (!security.currentPassword) { setSecErr('Enter current password'); return }
    if (security.currentPassword !== currentUser.password) {
      setSecErr('Current password is incorrect'); return
    }
    if (security.newPassword.length < 6) { setSecErr('New password must be at least 6 characters'); return }
    if (security.newPassword !== security.confirmPassword) { setSecErr('Passwords do not match'); return }

    const updatedUser = { ...currentUser, password: security.newPassword }
    setCurrentUser(updatedUser)
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u))
    setSecOk(true)
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setSecOk(false), 3000)
  }

  const tabs = [
    { id: 'profile',    label: 'Profile',       icon: User },
    { id: 'notifs',     label: 'Notifications', icon: Bell },
    { id: 'security',   label: 'Security',      icon: Shield },
    { id: 'appearance', label: 'Appearance',    icon: Palette },
  ]

  const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your account and system preferences" />

      {/* Tabs */}
      <div className={`${card} p-1 flex gap-1`}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition
              ${activeTab === id
                ? 'bg-green-500 text-white shadow-sm'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div className={`${card} p-6 space-y-5`}>
          {/* Avatar + current info */}
          <div className={`flex items-center gap-4 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-white text-2xl font-bold select-none">
              {(profile.fullName || currentUser?.fullName || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{currentUser?.fullName}</h3>
              <p className="text-gray-400 text-sm">{currentUser?.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1
                ${currentUser?.role === 'officer'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}>
                {currentUser?.isSuperAdmin ? '⭐ Super Admin' : currentUser?.role === 'officer' ? '🏛 Municipality Officer' : '👤 Citizen'}
              </span>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Your full name"
              />
            </FormField>
            <FormField label="Email Address" required>
              <Input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                placeholder="you@example.com"
              />
            </FormField>
            <FormField label="Phone Number">
              <Input
                value={profile.phoneNumber}
                onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                placeholder="0911000000"
              />
            </FormField>
            <FormField label="National ID">
              <Input
                value={currentUser?.nationalId || ''}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </FormField>
          </div>

          <FormField label="Address">
            <Input
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
              placeholder="Sub-city, City"
            />
          </FormField>

          {profileErr && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {profileErr}
            </div>
          )}

          <Button onClick={saveProfile}>
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </Button>
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {activeTab === 'notifs' && (
        <div className={`${card} p-6`}>
          <h3 className="font-semibold mb-4">Notification Preferences</h3>
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            <Toggle checked={notifs.emailNotifs}  onChange={v => setNotifs({ ...notifs, emailNotifs: v })}  label="Email Notifications" />
            <Toggle checked={notifs.smsNotifs}    onChange={v => setNotifs({ ...notifs, smsNotifs: v })}    label="SMS Notifications" />
            <Toggle checked={notifs.landUpdates}  onChange={v => setNotifs({ ...notifs, landUpdates: v })}  label="Land Request Updates" />
            <Toggle checked={notifs.infraUpdates} onChange={v => setNotifs({ ...notifs, infraUpdates: v })} label="Infrastructure Report Updates" />
            <Toggle checked={notifs.systemAlerts} onChange={v => setNotifs({ ...notifs, systemAlerts: v })} label="System Alerts" />
          </div>
          <Button
            className="mt-4"
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          >
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
          </Button>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <div className={`${card} p-6 space-y-4`}>
          <h3 className="font-semibold">Change Password</h3>

          <FormField label="Current Password">
            <Input
              type="password"
              value={security.currentPassword}
              onChange={e => setSecurity({ ...security, currentPassword: e.target.value })}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </FormField>
          <FormField label="New Password">
            <Input
              type="password"
              value={security.newPassword}
              onChange={e => setSecurity({ ...security, newPassword: e.target.value })}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
          </FormField>
          <FormField label="Confirm New Password">
            <Input
              type="password"
              value={security.confirmPassword}
              onChange={e => setSecurity({ ...security, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </FormField>

          {secErr && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {secErr}
            </div>
          )}
          {secOk && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
              ✅ Password updated successfully!
            </div>
          )}

          <Button onClick={changePassword}>
            <Shield size={16} /> Update Password
          </Button>

          {/* Account info */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className="font-semibold text-sm mb-3">Account Information</h4>
            <div className="space-y-2 text-sm">
              {[
                ['Account ID',   currentUser?.id],
                ['Role',         currentUser?.isSuperAdmin ? 'Super Admin' : currentUser?.role],
                ['Member Since', currentUser?.createdAt],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-semibold capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Appearance Tab ── */}
      {activeTab === 'appearance' && (
        <div className={`${card} p-6 space-y-4`}>
          <h3 className="font-semibold">Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDarkMode(false)}
              className={`p-4 rounded-2xl border-2 transition text-left
                ${!darkMode ? 'border-green-500 bg-green-50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
            >
              <div className="w-full h-16 bg-white rounded-xl border border-gray-200 mb-3 flex items-center justify-center">
                <div className="w-8 h-2 bg-gray-200 rounded" />
              </div>
              <p className={`text-sm font-semibold ${!darkMode ? 'text-green-600' : 'text-gray-400'}`}>
                ☀️ Light Mode {!darkMode && '✓'}
              </p>
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`p-4 rounded-2xl border-2 transition text-left
                ${darkMode ? 'border-green-500 bg-green-500/10' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="w-full h-16 bg-gray-900 rounded-xl border border-gray-700 mb-3 flex items-center justify-center">
                <div className="w-8 h-2 bg-gray-700 rounded" />
              </div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-gray-700'}`}>
                🌙 Dark Mode {darkMode && '✓'}
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
