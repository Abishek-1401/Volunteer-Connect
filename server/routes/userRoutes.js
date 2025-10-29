import express from 'express';
import multer from 'multer';
import { registerUser, loginUser, getMe, getUserSuggestions, followUser, unfollowUser, getFollowers, updateProfile, searchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.originalname.split('.').pop()}`);
  }
});
const upload = multer({ storage });

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

// @route   GET /api/users/:id/followers
router.get('/:id/followers', protect, getFollowers);

// @route   PUT /api/users/update-profile
router.put('/update-profile', protect, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), updateProfile);

// @route   GET /api/users/search
router.get('/search', protect, searchUsers);

export default router;
