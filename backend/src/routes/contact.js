const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route - no authentication required
router.post('/submit', contactController.submitContactForm);

// Protected routes - require authentication
router.get('/', protect, authorize('officer'), contactController.getAllMessages);
router.get('/stats', protect, authorize('officer'), contactController.getMessageStats);
router.get('/:id', protect, authorize('officer'), contactController.getMessageById);
router.post('/:id/reply', protect, authorize('officer'), contactController.replyToMessage);
router.patch('/:id', protect, authorize('officer'), contactController.updateMessageStatus);
router.delete('/:id', protect, authorize('officer'), contactController.deleteMessage);

module.exports = router;
