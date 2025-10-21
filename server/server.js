const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Initialize the app
const app = express();

// --- ADD THIS ---
// This is a middleware that allows our app to accept JSON data
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- ADD THIS ---
// This tells the app to use our new user routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});