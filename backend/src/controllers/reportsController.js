import LandRequest from '../models/LandRequest.js'
import InfraReport from '../models/InfraReport.js'

// GET /api/reports/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const { from, to } = req.query
    const dateFilter = {}
    if (from) dateFilter.$gte = new Date(from)
    if (to)   dateFilter.$lte = new Date(to)

    const landDateFilter  = from || to ? { applicationDate: dateFilter } : {}
    const infraDateFilter = from || to ? { reportDate: dateFilter } : {}

    const [
      totalLand, approvedLand, totalInfra, resolvedInfra,
      landByType, landByStatus, infraByType, infraByStatus,
    ] = await Promise.all([
      LandRequest.countDocuments(landDateFilter),
      LandRequest.countDocuments({ ...landDateFilter, status: 'Approved' }),
      InfraReport.countDocuments(infraDateFilter),
      InfraReport.countDocuments({ ...infraDateFilter, status: 'Resolved' }),
      LandRequest.aggregate([
        { $match: landDateFilter },
        { $group: { _id: '$landType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LandRequest.aggregate([
        { $match: landDateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      InfraReport.aggregate([
        { $match: infraDateFilter },
        { $group: { _id: '$issueType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      InfraReport.aggregate([
        { $match: infraDateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ])

    // Monthly trend for the year
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const year = from ? new Date(from).getFullYear() : new Date().getFullYear()

    const monthlyTrend = await Promise.all(months.map(async (month, i) => {
      const start = new Date(year, i, 1)
      const end   = new Date(year, i + 1, 0, 23, 59, 59)
      const [land, infra] = await Promise.all([
        LandRequest.countDocuments({ applicationDate: { $gte: start, $lte: end } }),
        InfraReport.countDocuments({ reportDate:      { $gte: start, $lte: end } }),
      ])
      return { month, land, infra }
    }))

    res.json({
      totalLand, approvedLand, totalInfra, resolvedInfra,
      landByType, landByStatus, infraByType, infraByStatus,
      monthlyTrend,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/export/land
export const exportLand = async (req, res, next) => {
  try {
    const { from, to } = req.query
    const filter = {}
    if (from || to) {
      filter.applicationDate = {}
      if (from) filter.applicationDate.$gte = new Date(from)
      if (to)   filter.applicationDate.$lte = new Date(to)
    }

    const records = await LandRequest.find(filter)
      .populate('citizen', 'fullName nationalId phoneNumber email')
      .sort({ createdAt: -1 })

    const headers = ['Request ID','Citizen','National ID','Phone','Land Type','Size','Location','Purpose','Application Date','Status','Land ID','Officer Note']
    const rows = records.map(r => [
      r.requestId,
      r.citizen?.fullName || '',
      r.citizen?.nationalId || '',
      r.citizen?.phoneNumber || '',
      r.landType, r.size, r.location, r.purpose,
      r.applicationDate?.toISOString().slice(0,10),
      r.status, r.landId || '', r.officerNote || '',
    ])

    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=land-requests.csv')
    res.send(csv)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/export/infra
export const exportInfra = async (req, res, next) => {
  try {
    const { from, to } = req.query
    const filter = {}
    if (from || to) {
      filter.reportDate = {}
      if (from) filter.reportDate.$gte = new Date(from)
      if (to)   filter.reportDate.$lte = new Date(to)
    }

    const records = await InfraReport.find(filter)
      .populate('citizen', 'fullName nationalId phoneNumber email')
      .sort({ createdAt: -1 })

    const headers = ['Report ID','Citizen','National ID','Phone','Issue Type','Location','Description','Report Date','Status','Officer Note']
    const rows = records.map(r => [
      r.reportId,
      r.citizen?.fullName || '',
      r.citizen?.nationalId || '',
      r.citizen?.phoneNumber || '',
      r.issueType, r.location, r.description,
      r.reportDate?.toISOString().slice(0,10),
      r.status, r.officerNote || '',
    ])

    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=infra-reports.csv')
    res.send(csv)
  } catch (err) {
    next(err)
  }
}
