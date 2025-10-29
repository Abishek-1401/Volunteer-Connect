import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Make io accessible in routes
app.set('io', io);

// Enable CORS
app.use(cors());

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), '..', 'uploads')));

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

// --- Notification routes are ACTIVE ---
import notificationRoutes from './routes/notificationRoutes.js';
app.use('/api/notifications', notificationRoutes);


const PORT = process.env.PORT || 5000;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle new message
  socket.on('sendMessage', (data) => {
    const { conversationId, message } = data;
    // Broadcast to all users in the conversation except sender
    socket.to(conversationId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
