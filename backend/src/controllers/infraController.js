import InfraReport from '../models/InfraReport.js'
import { notifyAllOfficers, createNotification } from './notificationController.js'

// GET /api/infra-reports
export const getInfraReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const filter = {}
    if (req.user.role === 'citizen') filter.citizen = req.user._id
    if (status) filter.status = status

    if (search) {
      filter.$or = [
        { reportId:   { $regex: search, $options: 'i' } },
        { location:   { $regex: search, $options: 'i' } },
        { issueType:  { $regex: search, $options: 'i' } },
        { description:{ $regex: search, $options: 'i' } },
      ]
    }

    const [reports, total] = await Promise.all([
      InfraReport.find(filter)
        .populate('citizen', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InfraReport.countDocuments(filter),
    ])

    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    next(err)
  }
}

// POST /api/infra-reports
export const createInfraReport = async (req, res, next) => {
  try {
    const { issueType, location, description, reportDate } = req.body
    const report = await InfraReport.create({
      citizen: req.user._id,
      issueType, location, description,
      reportDate: reportDate || new Date(),
    })
    await report.populate('citizen', 'fullName email')
    
    // Notify all officers about new infrastructure report
    await notifyAllOfficers({
      type: 'infra_report_submitted',
      title: 'New Infrastructure Report',
      message: `${req.user.fullName} reported a ${issueType} issue at ${location}`,
      relatedId: report._id,
      relatedModel: 'InfraReport',
      sender: req.user._id,
      priority: 'high',
      actionUrl: `/officer/infra`
    });
    
    res.status(201).json(report)
  } catch (err) {
    next(err)
  }
}

// GET /api/infra-reports/:id
export const getInfraReportById = async (req, res, next) => {
  try {
    const report = await InfraReport.findById(req.params.id)
      .populate('citizen', 'fullName email nationalId phoneNumber')
      .populate('reviewedBy', 'fullName')

    if (!report) return res.status(404).json({ message: 'Report not found' })

    if (req.user.role === 'citizen' && report.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(report)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/infra-reports/:id/status  (officer only)
export const updateInfraStatus = async (req, res, next) => {
  try {
    const { status, officerNote } = req.body
    const allowed = ['Pending', 'In Progress', 'Resolved']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const report = await InfraReport.findByIdAndUpdate(
      req.params.id,
      { status, officerNote: officerNote || '', reviewedBy: req.user._id },
      { new: true }
    ).populate('citizen', 'fullName email')

    if (!report) return res.status(404).json({ message: 'Report not found' })
    
    // Notify citizen about status change
    if (status === 'Resolved') {
      await createNotification({
        recipient: report.citizen._id,
        sender: req.user._id,
        type: 'infra_report_resolved',
        title: 'Infrastructure Report Resolved',
        message: `Your ${report.issueType} report at ${report.location} has been resolved. ${officerNote || ''}`,
        relatedId: report._id,
        relatedModel: 'InfraReport',
        priority: 'medium',
        actionUrl: '/infra-reports'
      });
    }
    
    res.json(report)
  } catch (err) {
    next(err)
  }
}
