import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { fullName, nationalId, phoneNumber, email, address, password } = req.body

    // Validate nationalId is digits only
    if (!/^\d{8,12}$/.test(nationalId)) {
      return res.status(400).json({ message: 'National ID must be 8–12 digits (numbers only)' })
    }

    const existing = await User.findOne({ $or: [{ email }, { nationalId }] })
    if (existing) {
      return res.status(400).json({
        message: existing.email === email ? 'Email already registered' : 'National ID already registered',
      })
    }

    const user = await User.create({ fullName, nationalId, phoneNumber, email, address, password, role: 'citizen' })
    const token = signToken(user._id)

    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user)
}

// PATCH /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, phoneNumber, address },
      { new: true, runValidators: true }
    )
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}
