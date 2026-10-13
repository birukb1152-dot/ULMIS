import { Router } from 'express'
import { getAnalytics, exportLand, exportInfra } from '../controllers/reportsController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/analytics',    getAnalytics)
router.get('/export/land',  exportLand)
router.get('/export/infra', exportInfra)

export default router
