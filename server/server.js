import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- User routes are ACTIVE ---
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);

// --- Other routes are ACTIVE ---
import postRoutes from './routes/postRoutes.js';
app.use('/api/posts', postRoutes);

// --- Messaging routes are ACTIVE ---
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// --- Group routes are ACTIVE ---
import groupRoutes from './routes/groupRoutes.js';
app.use('/api/groups', groupRoutes);

// --- Project routes are ACTIVE ---
import projectRoutes from './routes/projectRoutes.js';
app.use('/api/projects', projectRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});