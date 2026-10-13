import { Router } from 'express'
import { getUsers, getUserById } from '../controllers/userController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect, authorize('officer'))

router.get('/',    getUsers)
router.get('/:id', getUserById)

export default router
