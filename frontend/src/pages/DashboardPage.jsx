import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import KpiCard from '../components/ui/KpiCard'
import StatusBadge from '../components/ui/StatusBadge'
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { FileText, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DashboardPage() {
  const { currentUser, darkMode, landRequests, infraReports, users } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Calculate stats from context data
  const stats = useMemo(() => {
    if (currentUser.role === 'officer') {
      // Officer stats - all data
      const totalLand = landRequests.length
      const pendingLand = landRequests.filter(r => r.status === 'Pending').length
      const approvedLand = landRequests.filter(r => r.status === 'Approved').length
      const pendingInfra = infraReports.filter(r => r.status === 'Pending').length
      const totalUsers = users.filter(u => u.role === 'citizen').length

      // Land by type
      const landByType = landRequests.reduce((acc, req) => {
        const existing = acc.find(item => item._id === req.landType)
        if (existing) {
          existing.count++
        } else {
          acc.push({ _id: req.landType, count: 1 })
        }
        return acc
      }, [])

      // Land by status
      const landByStatus = landRequests.reduce((acc, req) => {
        const existing = acc.find(item => item._id === req.status)
        if (existing) {
          existing.count++
        } else {
          acc.push({ _id: req.status, count: 1 })
        }
        return acc
      }, [])

      // Recent land requests (last 5)
      const recentLand = landRequests
        .slice(0, 5)
        .map(r => ({
          _id: r.id,
          requestId: r.id,
          location: r.location,
          landType: r.landType,
          status: r.status,
          applicationDate: r.applicationDate
        }))

      // Recent activity
      const recentActivity = [
        ...landRequests.slice(0, 3).map(r => ({
          type: 'land',
          text: `Land request ${r.id} ${r.status.toLowerCase()}`,
          time: r.updatedAt
        })),
        ...infraReports.slice(0, 2).map(r => ({
          type: 'infra',
          text: `Infrastructure report ${r.id} ${r.status.toLowerCase()}`,
          time: r.updatedAt
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

      return {
        totalLand,
        pendingLand,
        approvedLand,
        pendingInfra,
        totalUsers,
        landByType,
        landByStatus,
        recentLand,
        recentActivity
      }
    } else {
      // Citizen stats - only their data
      const myLandRequests = landRequests.filter(r => r.citizenId === currentUser.id)
      const myInfraReports = infraReports.filter(r => r.citizenId === currentUser.id)
      
      const myLand = myLandRequests.length
      const myPending = myLandRequests.filter(r => r.status === 'Pending').length
      const myApproved = myLandRequests.filter(r => r.status === 'Approved').length
      const myInfra = myInfraReports.length

      // Land by type for citizen (their own requests)
      const landByType = myLandRequests.reduce((acc, req) => {
        const existing = acc.find(item => item._id === req.landType)
        if (existing) {
          existing.count++
        } else {
          acc.push({ _id: req.landType, count: 1 })
        }
        return acc
      }, [])

      // Land by status for citizen (their own requests)
      const landByStatus = myLandRequests.reduce((acc, req) => {
        const existing = acc.find(item => item._id === req.status)
        if (existing) {
          existing.count++
        } else {
          acc.push({ _id: req.status, count: 1 })
        }
        return acc
      }, [])

      // Recent land requests for citizen
      const recentLand = myLandRequests
        .slice(0, 5)
        .map(r => ({
          _id: r.id,
          requestId: r.id,
          location: r.location,
          landType: r.landType,
          status: r.status,
          applicationDate: r.applicationDate
        }))

      // Recent activity for citizen
      const recentActivity = [
        ...myLandRequests.slice(0, 3).map(r => ({
          type: 'land',
          text: `Your land request ${r.id} ${r.status.toLowerCase()}`,
          time: r.updatedAt
        })),
        ...myInfraReports.slice(0, 2).map(r => ({
          type: 'infra',
          text: `Your infrastructure report ${r.id} ${r.status.toLowerCase()}`,
          time: r.updatedAt
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

      return {
        myLand,
        myPending,
        myApproved,
        myInfra,
        landByType,
        landByStatus,
        recentLand,
        recentActivity
      }
    }
  }, [currentUser, landRequests, infraReports, users])

  const card = `rounded-2xl border shadow-lg p-6 transition-all duration-300 ${
    darkMode 
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:shadow-emerald-500/10' 
      : 'bg-white border-gray-200 hover:shadow-xl'
  }`
  const tooltipStyle = darkMode
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }
    : { backgroundColor: '#fff',    border: '1px solid #e5e7eb', color: '#111827' }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  )

  const s = stats || {}
  const landByType   = s.landByType   || []
  const landByStatus = s.landByStatus || []
  const recentLand   = s.recentLand   || []
  const recentActivity = s.recentActivity || []

  const kpis = currentUser.role === 'officer'
    ? [
        { icon: FileText,      label: 'Total Land Applications', value: s.totalLand   ?? 0, color: 'green',  sub: 'All time' },
        { icon: Clock,         label: 'Pending Applications',    value: s.pendingLand ?? 0, color: 'yellow', sub: 'Awaiting review' },
        { icon: CheckCircle,   label: 'Approved Applications',   value: s.approvedLand?? 0, color: 'blue',   sub: 'Completed' },
        { icon: AlertTriangle, label: 'Open Infra Reports',      value: s.pendingInfra?? 0, color: 'red',    sub: 'Need attention' },
        { icon: Users,         label: 'Registered Citizens',     value: s.totalUsers  ?? 0, color: 'purple', sub: 'Active users' },
      ]
    : [
        { icon: FileText,      label: 'My Land Requests',  value: s.myLand      ?? 0, color: 'green',  sub: 'Total submitted' },
        { icon: Clock,         label: 'Pending',           value: s.myPending   ?? 0, color: 'yellow', sub: 'Awaiting review' },
        { icon: CheckCircle,   label: 'Approved',          value: s.myApproved  ?? 0, color: 'blue',   sub: 'Approved requests' },
        { icon: AlertTriangle, label: 'My Infra Reports',  value: s.myInfra     ?? 0, color: 'red',    sub: 'Total reported' },
      ]

  return (
    <div className="space-y-6 page-enter">
      {/* Header with gradient */}
      <div className={`rounded-2xl p-6 ${
        darkMode 
          ? 'bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border border-slate-700' 
          : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-100'
      }`}>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {currentUser.fullName.split(' ')[0]} 👋
        </h1>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {currentUser.role === 'officer'
            ? "Here's an overview of all land and infrastructure activities."
            : 'Track your land requests and infrastructure reports here.'}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${card} lg:col-span-2`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.role === 'officer' ? 'Land Applications by Type' : 'My Requests by Type'}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Distribution overview
              </p>
            </div>
          </div>
          {landByType.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-gray-400">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}>
                  <FileText size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">
                  {currentUser.role === 'officer' ? 'No applications yet' : 'No land requests yet'}
                </p>
                <p className="text-xs mt-1">Data will appear here once submitted</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={landByType} barSize={40}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Activity size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.role === 'officer' ? 'Application Status' : 'My Request Status'}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Current breakdown
              </p>
            </div>
          </div>
          {landByStatus.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-gray-400">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}>
                  <Activity size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">
                  {currentUser.role === 'officer' ? 'No applications yet' : 'No land requests yet'}
                </p>
                <p className="text-xs mt-1">Status chart will appear here</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <defs>
                  {COLORS.map((color, i) => (
                    <linearGradient key={i} id={`pieGradient${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie data={landByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  dataKey="count" nameKey="_id" paddingAngle={4}>
                  {landByStatus.map((_, i) => <Cell key={i} fill={`url(#pieGradient${i})`} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.role === 'officer' ? 'Recent Land Requests' : 'My Recent Land Requests'}
              </h3>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Latest submissions and updates
              </p>
            </div>
          </div>
          <div className={`${card} overflow-hidden p-0`}>
            <Table>
              <Thead><tr>
                <Th>ID</Th><Th>Location</Th><Th>Type</Th><Th>Status</Th><Th>Date</Th>
              </tr></Thead>
              <Tbody>
                {recentLand.length === 0
                  ? <Tr><Td colSpan={5} className="text-center py-12">
                      <div className="text-gray-400">
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                          darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                        }`}>
                          <FileText size={32} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">No requests yet</p>
                        <p className="text-xs mt-1">Submit your first land request to get started</p>
                      </div>
                    </Td></Tr>
                  : recentLand.map(r => (
                    <Tr key={r._id}>
                      <Td><span className="font-mono text-xs font-bold text-emerald-500">{r.requestId}</span></Td>
                      <Td className="max-w-[160px] truncate">{r.location}</Td>
                      <Td><span className={`text-xs px-2 py-1 rounded-lg ${
                        darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>{r.landType}</span></Td>
                      <Td><StatusBadge status={r.status} /></Td>
                      <Td className="text-xs text-gray-400">{r.applicationDate?.slice(0,10)}</Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </div>
        </div>

        <div className={card}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Activity size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Latest updates</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-100'
                }`}>
                  <Activity size={24} className="opacity-50" />
                </div>
                <p className="text-xs">No recent activity</p>
              </div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    a.type === 'land' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{a.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.time?.slice(0,10)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
