import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';

// Connect to the database
connectDB();

// Initialize the app
const app = express();

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

// app.use('/api/projects', require('./routes/projectRoutes')); // (If you have this)
// app.use('/api/groups', require('./routes/groupRoutes'));   // (If you have this)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});