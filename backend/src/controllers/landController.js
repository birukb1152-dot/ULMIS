import LandRequest from '../models/LandRequest.js'
import { notifyAllOfficers, createNotification } from './notificationController.js'

// GET /api/land-requests
export const getLandRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, all } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const filter = {}

    // Citizens see only their own; officers see all (when all=true)
    if (req.user.role === 'citizen') {
      filter.citizen = req.user._id
    }

    if (status) filter.status = status

    if (search) {
      filter.$or = [
        { requestId: { $regex: search, $options: 'i' } },
        { location:  { $regex: search, $options: 'i' } },
        { landType:  { $regex: search, $options: 'i' } },
        { landId:    { $regex: search, $options: 'i' } },
      ]
    }

    const [requests, total] = await Promise.all([
      LandRequest.find(filter)
        .populate('citizen', 'fullName email nationalId phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      LandRequest.countDocuments(filter),
    ])

    res.json({ requests, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    next(err)
  }
}

// POST /api/land-requests
export const createLandRequest = async (req, res, next) => {
  try {
    const { landType, size, location, purpose, applicationDate } = req.body
    const request = await LandRequest.create({
      citizen: req.user._id,
      landType, size, location, purpose,
      applicationDate: applicationDate || new Date(),
    })
    await request.populate('citizen', 'fullName email')
    
    // Notify all officers about new land request
    await notifyAllOfficers({
      type: 'land_request_submitted',
      title: 'New Land Request Submitted',
      message: `${req.user.fullName} has submitted a new land request for ${landType} (${size} sq.m) at ${location}`,
      relatedId: request._id,
      relatedModel: 'LandRequest',
      sender: req.user._id,
      priority: 'high',
      actionUrl: `/officer/land`
    });
    
    res.status(201).json(request)
  } catch (err) {
    next(err)
  }
}

// GET /api/land-requests/:id
export const getLandRequestById = async (req, res, next) => {
  try {
    const request = await LandRequest.findById(req.params.id)
      .populate('citizen', 'fullName email nationalId phoneNumber')
      .populate('reviewedBy', 'fullName')

    if (!request) return res.status(404).json({ message: 'Land request not found' })

    // Citizens can only view their own
    if (req.user.role === 'citizen' && request.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(request)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/land-requests/:id/status  (officer only)
export const updateLandStatus = async (req, res, next) => {
  try {
    const { status, landId, officerNote } = req.body
    const allowed = ['Pending', 'Under Review', 'Approved', 'Rejected']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const update = { status, officerNote: officerNote || '', reviewedBy: req.user._id }
    if (status === 'Approved' && landId) update.landId = landId

    const request = await LandRequest.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('citizen', 'fullName email')

    if (!request) return res.status(404).json({ message: 'Land request not found' })
    
    // Notify citizen about status change
    if (status === 'Approved' || status === 'Rejected') {
      await createNotification({
        recipient: request.citizen._id,
        sender: req.user._id,
        type: status === 'Approved' ? 'land_request_approved' : 'land_request_rejected',
        title: `Land Request ${status}`,
        message: status === 'Approved' 
          ? `Your land request for ${request.landType} at ${request.location} has been approved! Land ID: ${landId || 'Pending'}`
          : `Your land request for ${request.landType} at ${request.location} has been rejected. Reason: ${officerNote || 'Not specified'}`,
        relatedId: request._id,
        relatedModel: 'LandRequest',
        priority: 'high',
        actionUrl: '/land-requests'
      });
    }
    
    res.json(request)
  } catch (err) {
    next(err)
  }
}
