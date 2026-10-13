import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

// Routes
import authRoutes      from './routes/authRoutes.js'
import landRoutes      from './routes/landRoutes.js'
import infraRoutes     from './routes/infraRoutes.js'
import userRoutes      from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reportsRoutes   from './routes/reportsRoutes.js'
import contactRoutes   from './routes/contactRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Urban Land API is running', timestamp: new Date() })
})

// API Routes
app.use('/api/auth',       authRoutes)
app.use('/api/land-requests', landRoutes)
app.use('/api/infra-reports', infraRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/dashboard',  dashboardRoutes)
app.use('/api/reports',    reportsRoutes)
app.use('/api/contact',    contactRoutes)
app.use('/api/notifications', notificationRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📋 Environment: ${process.env.NODE_ENV}`)
})
