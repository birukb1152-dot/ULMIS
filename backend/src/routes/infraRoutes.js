import { Router } from 'express'
import {
  getInfraReports, createInfraReport,
  getInfraReportById, updateInfraStatus,
} from '../controllers/infraController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/',    getInfraReports)
router.post('/',   authorize('citizen'), createInfraReport)
router.get('/:id', getInfraReportById)
router.patch('/:id/status', authorize('officer'), updateInfraStatus)

export default router
