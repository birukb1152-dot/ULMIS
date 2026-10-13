import { Router } from 'express'
import {
  getLandRequests, createLandRequest,
  getLandRequestById, updateLandStatus,
} from '../controllers/landController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/',    getLandRequests)
router.post('/',   authorize('citizen'), createLandRequest)
router.get('/:id', getLandRequestById)
router.patch('/:id/status', authorize('officer'), updateLandStatus)

export default router
