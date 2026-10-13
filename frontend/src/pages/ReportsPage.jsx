import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Download, BarChart2 } from 'lucide-react'

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4']

export default function ReportsPage() {
  const { darkMode, landRequests, infraReports } = useApp()
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo]     = useState('2024-12-31')

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [dateFrom, dateTo])

  // Calculate analytics from context data
  const data = useMemo(() => {
    // Filter data by date range
    const filteredLandRequests = landRequests.filter(r => {
      const date = new Date(r.applicationDate)
      return date >= new Date(dateFrom) && date <= new Date(dateTo)
    })
    
    const filteredInfraReports = infraReports.filter(r => {
      const date = new Date(r.reportDate)
      return date >= new Date(dateFrom) && date <= new Date(dateTo)
    })

    // Basic stats
    const totalLand = filteredLandRequests.length
    const approvedLand = filteredLandRequests.filter(r => r.status === 'Approved').length
    const totalInfra = filteredInfraReports.length
    const resolvedInfra = filteredInfraReports.filter(r => r.status === 'Resolved').length

    // Land by type
    const landByType = filteredLandRequests.reduce((acc, req) => {
      const existing = acc.find(item => item._id === req.landType)
      if (existing) {
        existing.count++
      } else {
        acc.push({ _id: req.landType, count: 1 })
      }
      return acc
    }, [])

    // Land by status
    const landByStatus = filteredLandRequests.reduce((acc, req) => {
      const existing = acc.find(item => item._id === req.status)
      if (existing) {
        existing.count++
      } else {
        acc.push({ _id: req.status, count: 1 })
      }
      return acc
    }, [])

    // Infra by type
    const infraByType = filteredInfraReports.reduce((acc, rep) => {
      const existing = acc.find(item => item._id === rep.issueType)
      if (existing) {
        existing.count++
      } else {
        acc.push({ _id: rep.issueType, count: 1 })
      }
      return acc
    }, [])

    // Infra by status
    const infraByStatus = filteredInfraReports.reduce((acc, rep) => {
      const existing = acc.find(item => item._id === rep.status)
      if (existing) {
        existing.count++
      } else {
        acc.push({ _id: rep.status, count: 1 })
      }
      return acc
    }, [])

    // Monthly trend (simplified)
    const monthlyTrend = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    months.forEach((month, index) => {
      const landCount = filteredLandRequests.filter(r => {
        const date = new Date(r.applicationDate)
        return date.getMonth() === index
      }).length
      
      const infraCount = filteredInfraReports.filter(r => {
        const date = new Date(r.reportDate)
        return date.getMonth() === index
      }).length
      
      monthlyTrend.push({
        month,
        land: landCount,
        infra: infraCount
      })
    })

    return {
      totalLand,
      approvedLand,
      totalInfra,
      resolvedInfra,
      landByType,
      landByStatus,
      infraByType,
      infraByStatus,
      monthlyTrend
    }
  }, [landRequests, infraReports, dateFrom, dateTo])

  const exportCSV = async (type) => {
    try {
      // Create CSV data from context
      let csvData = ''
      let filename = ''
      
      if (type === 'land') {
        const headers = 'ID,Citizen Name,Land Type,Size,Location,Purpose,Status,Application Date,Updated At\n'
        const rows = landRequests.map(r => 
          `${r.id},"${r.citizenName}","${r.landType}","${r.size}","${r.location}","${r.purpose}","${r.status}","${r.applicationDate}","${r.updatedAt}"`
        ).join('\n')
        csvData = headers + rows
        filename = 'land-requests.csv'
      } else {
        const headers = 'ID,Citizen Name,Issue Type,Location,Description,Status,Report Date,Updated At\n'
        const rows = infraReports.map(r => 
          `${r.id},"${r.citizenName}","${r.issueType}","${r.location}","${r.description}","${r.status}","${r.reportDate}","${r.updatedAt}"`
        ).join('\n')
        csvData = headers + rows
        filename = 'infrastructure-reports.csv'
      }
      
      // Download CSV
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { 
      console.error(e) 
    }
  }

  const card = `rounded-2xl border shadow-sm p-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`
  const tooltipStyle = darkMode
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }
    : { backgroundColor: '#fff',    border: '1px solid #e5e7eb', color: '#111827' }

  const d = data || {}

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Insights and statistics on land and infrastructure activities" />

      {/* Filters */}
      <div className={`${card} flex flex-wrap items-center gap-4`}>
        <div className="flex items-center gap-2 text-sm">
          <label className={darkMode ? 'text-gray-400' : 'text-gray-500'}>From:</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'}`} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className={darkMode ? 'text-gray-400' : 'text-gray-500'}>To:</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'}`} />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => exportCSV('land')}>
            <Download size={14} /> Land CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCSV('infra')}>
            <Download size={14} /> Infra CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Land Requests',   value: d.totalLand    ?? 0, color: 'text-green-500' },
              { label: 'Approved',        value: d.approvedLand ?? 0, color: 'text-blue-500' },
              { label: 'Infra Reports',   value: d.totalInfra   ?? 0, color: 'text-yellow-500' },
              { label: 'Resolved Issues', value: d.resolvedInfra?? 0, color: 'text-purple-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className={card}>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Monthly trend */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-green-500" />
              <h3 className="font-semibold">Monthly Activity Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={d.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="land"  stroke="#22c55e" strokeWidth={2} dot={{ r:4 }} name="Land Requests" />
                <Line type="monotone" dataKey="infra" stroke="#3b82f6" strokeWidth={2} dot={{ r:4 }} name="Infra Reports" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={card}>
              <h3 className="font-semibold mb-4">Land Requests by Type</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.landByType || []} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
                  <XAxis dataKey="_id" tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#22c55e" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={card}>
              <h3 className="font-semibold mb-4">Application Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={d.landByStatus || []} cx="50%" cy="50%" outerRadius={85} dataKey="count" nameKey="_id" paddingAngle={3}>
                    {(d.landByStatus || []).map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={card}>
              <h3 className="font-semibold mb-4">Infrastructure Issues by Type</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.infraByType || []} barSize={28} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
                  <XAxis type="number" tick={{ fontSize:11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                  <YAxis dataKey="_id" type="category" width={90} tick={{ fontSize:11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={card}>
              <h3 className="font-semibold mb-4">Infrastructure Report Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={d.infraByStatus || []} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="count" nameKey="_id" paddingAngle={3}>
                    {(d.infraByStatus || []).map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
