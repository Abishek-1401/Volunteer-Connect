import express from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupSuggestions,
  addMemberToGroup,
  searchGroups,
} from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/groups
router.get('/', getAllGroups);

// @route   GET /api/groups/search
router.get('/search', protect, searchGroups);

// @route   GET /api/groups/suggestions
router.get('/suggestions', protect, getGroupSuggestions);

// @route   GET /api/groups/:id
router.get('/:id', getGroupById);

// @route   POST /api/groups
router.post('/', protect, createGroup);

// @route   PUT /api/groups/:id/join
router.put('/:id/join', protect, joinGroup);

// @route   PUT /api/groups/:id/leave
router.put('/:id/leave', protect, leaveGroup);

// @route   PUT /api/groups/:id/add-member
router.put('/:id/add-member', protect, addMemberToGroup);

export default router;
