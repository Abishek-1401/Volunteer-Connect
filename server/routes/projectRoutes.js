import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  joinProject,
  leaveProject,
  searchProjects,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/projects
router.get('/', getAllProjects);

// @route   GET /api/projects/search
router.get('/search', protect, searchProjects);

// @route   GET /api/projects/:id
router.get('/:id', getProjectById);

// @route   POST /api/projects
router.post('/', protect, createProject);

// @route   PUT /api/projects/:id/join
router.put('/:id/join', protect, joinProject);

// @route   PUT /api/projects/:id/leave
router.put('/:id/leave', protect, leaveProject);

export default router;
