import LandRequest from '../models/LandRequest.js'
import InfraReport from '../models/InfraReport.js'
import User from '../models/User.js'

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const isOfficer = req.user.role === 'officer'
    const citizenFilter = isOfficer ? {} : { citizen: req.user._id }

    const [
      totalLand, pendingLand, approvedLand,
      totalInfra, pendingInfra,
      totalUsers,
      landByType, landByStatus, infraByStatus,
      recentLand, recentInfra,
    ] = await Promise.all([
      LandRequest.countDocuments(citizenFilter),
      LandRequest.countDocuments({ ...citizenFilter, status: 'Pending' }),
      LandRequest.countDocuments({ ...citizenFilter, status: 'Approved' }),
      InfraReport.countDocuments(citizenFilter),
      InfraReport.countDocuments({ ...citizenFilter, status: 'Pending' }),
      isOfficer ? User.countDocuments({ role: 'citizen' }) : Promise.resolve(0),
      LandRequest.aggregate([
        { $match: citizenFilter },
        { $group: { _id: '$landType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LandRequest.aggregate([
        { $match: citizenFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      InfraReport.aggregate([
        { $match: citizenFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      LandRequest.find(citizenFilter)
        .populate('citizen', 'fullName')
        .sort({ createdAt: -1 })
        .limit(5),
      InfraReport.find(citizenFilter)
        .populate('citizen', 'fullName')
        .sort({ createdAt: -1 })
        .limit(5),
    ])

    // Build activity feed
    const recentActivity = [
      ...recentLand.map(r => ({ type: 'land', text: `Land request ${r.requestId} — ${r.status}`, time: r.updatedAt })),
      ...recentInfra.map(r => ({ type: 'infra', text: `Infra report ${r.reportId} — ${r.status}`, time: r.updatedAt })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8)

    res.json({
      // Officer stats
      totalLand, pendingLand, approvedLand,
      totalInfra, pendingInfra, totalUsers,
      // Citizen stats (same fields, filtered)
      myLand: totalLand, myPending: pendingLand, myApproved: approvedLand, myInfra: totalInfra,
      // Charts
      landByType, landByStatus, infraByStatus,
      recentLand, recentActivity,
    })
  } catch (err) {
    next(err)
  }
}
