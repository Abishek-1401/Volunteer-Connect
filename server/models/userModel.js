import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt

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
    select: false, // Don't send password back in queries by default
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  profileImage: {
    type: String,
    default: '/assets/default-avatar.png',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true, 
});

// --- ADD THIS: Password Hashing Middleware ---
// This runs automatically BEFORE a document is .save()'d
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with a cost factor of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- ADD THIS: Password Comparison Method ---
// This adds a custom method to all user documents
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// This creates the model that we'll use to interact with the 'users' collection
const User = mongoose.model('User', userSchema);

export default User;
