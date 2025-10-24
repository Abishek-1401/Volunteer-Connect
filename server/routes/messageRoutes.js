import express from 'express';
import {
  getMessages,
  sendMessage,
  markAsRead
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All message routes require authentication
router.use(protect);

// Get messages for a conversation
router.get('/:conversationId', getMessages);

// Send a message to a conversation
router.post('/:conversationId', sendMessage);

// Mark messages as read in a conversation
router.put('/:conversationId/read', markAsRead);

export default router;
