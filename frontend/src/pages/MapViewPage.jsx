import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import StatusBadge from '../components/ui/StatusBadge'
import PageHeader from '../components/ui/PageHeader'
import { MapPin, Filter } from 'lucide-react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLORS = {
  Approved:      '#22c55e',
  Pending:       '#f59e0b',
  'Under Review':'#3b82f6',
  Rejected:      '#ef4444',
}

function colorIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [28,28], iconAnchor: [14,28], popupAnchor: [0,-30],
  })
}

export default function MapViewPage() {
  const { darkMode, landRequests } = useApp()
  const [lands, setLands]           = useState([])
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType]     = useState('All')
  const [searchId, setSearchId]         = useState('')

  useEffect(() => {
    // Use context data instead of API call
    setLands(landRequests.map(req => ({
      _id: req.id,
      requestId: req.id,
      landType: req.landType,
      location: req.location,
      size: req.size,
      status: req.status,
      citizenName: req.citizenName,
      purpose: req.purpose,
      applicationDate: req.applicationDate
    })))
  }, [landRequests])

  // Assign fake coords for demo (real app would store lat/lng in DB)
  const BASE = { lat: 9.0192, lng: 38.7525 }
  const withCoords = lands.map((l, i) => ({
    ...l,
    lat: BASE.lat + (Math.sin(i * 1.3) * 0.05),
    lng: BASE.lng + (Math.cos(i * 1.7) * 0.07),
  }))

  const filtered = withCoords.filter(l => {
    if (filterStatus !== 'All' && l.status !== filterStatus) return false
    if (filterType   !== 'All' && l.landType !== filterType)  return false
    if (searchId && !l.requestId?.toLowerCase().includes(searchId.toLowerCase())) return false
    return true
  })

  const card = `rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`

  return (
    <div className="space-y-4">
      <PageHeader title="Map View" subtitle="Visual representation of land parcels across the city" />

      {/* Filters */}
      <div className={`${card} p-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Filter size={16} /> Filters:
          </div>
          <input value={searchId} onChange={e => setSearchId(e.target.value)}
            placeholder="Search Land ID..."
            className={`px-3 py-2 rounded-xl border text-sm outline-none w-40
              ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'}`}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'}`}>
            {['All','Approved','Pending','Under Review','Rejected'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'}`}>
            {['All','Residential','Commercial','Agricultural','Industrial'].map(t => <option key={t}>{t}</option>)}
          </select>
          <span className={`text-xs ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filtered.length} parcels
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([s,c]) => (
          <div key={s} className="flex items-center gap-1.5 text-xs font-medium">
            <div className="w-3 h-3 rounded-full" style={{ background: c }} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{s}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-md" style={{ height: 500 }}>
        <MapContainer center={[9.0192, 38.7525]} zoom={12} style={{ height:'100%', width:'100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map(land => (
            <Marker key={land._id} position={[land.lat, land.lng]}
              icon={colorIcon(STATUS_COLORS[land.status] || '#6b7280')}>
              <Popup>
                <div className="min-w-[180px]">
                  <div className="font-bold text-sm mb-1 text-green-600">{land.requestId}</div>
                  <div className="text-xs space-y-1">
                    <div><b>Type:</b> {land.landType}</div>
                    <div><b>Location:</b> {land.location}</div>
                    <div><b>Size:</b> {land.size}</div>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ background: STATUS_COLORS[land.status] }}>
                        {land.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0,6).map(land => (
          <div key={land._id} className={`${card} p-4 card-hover`}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-xs font-bold text-green-500">{land.requestId}</span>
              <StatusBadge status={land.status} />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
              <MapPin size={14} className="text-gray-400" />{land.location}
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {land.landType} · {land.size}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
