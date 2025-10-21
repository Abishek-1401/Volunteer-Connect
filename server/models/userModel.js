const mongoose = require('mongoose');

// This is the blueprint (Schema) for our user data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // No two users can have the same username
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true, 
});

// This creates the model that we'll use to interact with the 'users' collection
const User = mongoose.model('User', userSchema);

module.exports = User;