import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ msg: 'Username is already taken' });
    }

    // Create new user
    user = new User({ name, username, email, password });

    // The password will be hashed by the .pre('save') hook in userModel.js
    await user.save();

    // Find the newly saved user to get all fields (excluding password)
    const newUser = await User.findById(user.id).select('-password');

    // Create token
    const token = generateToken(user.id);
    
    res.status(201).json({
      token,
      user: newUser // Send user data back
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email, and explicitly select the password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Use the comparePassword method we will add to the model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create token
    const token = generateToken(user.id);

    // Don't send the password back
    const userResponse = await User.findById(user.id).select('-password');

    res.json({
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


// @desc    Get the logged in user's data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  // We already selected '-password' in the middleware
  res.json(req.user);
};

export {
  registerUser,
  loginUser,
  getMe,
};
