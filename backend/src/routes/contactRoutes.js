import express from 'express';
import * as contactController from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - no authentication required
router.post('/submit', contactController.submitContactForm);

// Protected routes - require authentication
router.get('/', protect, authorize('officer'), contactController.getAllMessages);
router.get('/stats', protect, authorize('officer'), contactController.getMessageStats);
router.get('/:id', protect, authorize('officer'), contactController.getMessageById);
router.post('/:id/reply', protect, authorize('officer'), contactController.replyToMessage);
router.patch('/:id', protect, authorize('officer'), contactController.updateMessageStatus);
router.delete('/:id', protect, authorize('officer'), contactController.deleteMessage);

export default router;
