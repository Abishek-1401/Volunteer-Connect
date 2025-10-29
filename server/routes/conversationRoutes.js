import express from 'express';
import {
  getConversations,
  createConversation,
  getConversation
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All conversation routes require authentication
router.use(protect);

// Get all conversations for user
router.get('/', getConversations);

// Create new conversation
router.post('/', createConversation);

// Get specific conversation
router.get('/:id', getConversation);

// Create group conversation
router.post('/group', createConversation);

export default router;
