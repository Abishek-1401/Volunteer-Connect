// server/routes/postRoutes.js
import express from 'express';
import {
  createPost,
  getPosts,
  likePost,
  updatePost,
  deletePost,
  getMyPosts,
  addComment,
  searchPosts
} from '../controllers/postController.js'; // Use require
import { protect } from '../middleware/authMiddleware.js'; // Use require

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

// Route for getting user's own posts
router.route('/myposts')
  .get(protect, getMyPosts);   // GET /api/posts/myposts

// Route for searching posts
router.route('/search')
  .get(protect, searchPosts);   // GET /api/posts/search

export default router; // Use module.exports
