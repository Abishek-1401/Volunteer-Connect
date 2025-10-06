// server/routes/userRoutes.js

import express from 'express';
// Import both controller functions
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Route: POST /api/users/register
router.post('/register', registerUser);

// Route: POST /api/users/login
router.post('/login', loginUser); 

export default router; 
