import User from '../models/User.js'
import LandRequest from '../models/LandRequest.js'
import InfraReport from '../models/InfraReport.js'

// GET /api/users  (officer only)
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const filter = {}
    if (role && role !== 'all') filter.role = role

    if (search) {
      filter.$or = [
        { fullName:   { $regex: search, $options: 'i' } },
        { email:      { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
        { phoneNumber:{ $regex: search, $options: 'i' } },
      ]
    }

    const [rawUsers, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])

    // Attach land and infra counts
    const users = await Promise.all(rawUsers.map(async (u) => {
      const [landCount, infraCount] = await Promise.all([
        LandRequest.countDocuments({ citizen: u._id }),
        InfraReport.countDocuments({ citizen: u._id }),
      ])
      return { ...u.toJSON(), landCount, infraCount }
    }))

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    next(err)
  }
}

// GET /api/users/:id  (officer only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const [landRequests, infraReports] = await Promise.all([
      LandRequest.find({ citizen: user._id }).sort({ createdAt: -1 }),
      InfraReport.find({ citizen: user._id }).sort({ createdAt: -1 }),
    ])

    res.json({ user, landRequests, infraReports })
  } catch (err) {
    next(err)
  }
}
