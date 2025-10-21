import express from 'express';
import {
  createPost,
  getPosts,
  likePost,
  updatePost, // Import new functions
  deletePost, // Import new functions
  addComment  // Import new functions
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing routes for creating and getting posts
router.route('/')
  .post(protect, createPost)
  .get(protect, getPosts);

// Routes for specific post actions (like, update, delete)
router.route('/:id')
  .put(protect, updatePost)    // PUT /api/posts/:id
  .delete(protect, deletePost); // DELETE /api/posts/:id

// Route for liking/unliking
router.route('/:id/like')
  .put(protect, likePost);    // PUT /api/posts/:id/like

// Route for adding comments
router.route('/:id/comments')
  .post(protect, addComment);   // POST /api/posts/:id/comments

export default router;