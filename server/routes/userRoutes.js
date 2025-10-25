import express from 'express';
import { registerUser, loginUser, getMe, getUserSuggestions, followUser, unfollowUser, searchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

// @route   GET /api/users/me
router.get('/me', protect, getMe);

// @route   GET /api/users/suggestions
router.get('/suggestions', protect, getUserSuggestions);

// @route   PUT /api/users/:id/follow
router.put('/:id/follow', protect, followUser);

// @route   PUT /api/users/:id/unfollow
router.put('/:id/unfollow', protect, unfollowUser);

// @route   GET /api/users/search
router.get('/search', protect, searchUsers);

export default router;
