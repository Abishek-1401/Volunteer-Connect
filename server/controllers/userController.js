import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createNotification } from './notificationController.js';

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

// @desc    Get user suggestions
// @route   GET /api/users/suggestions
// @access  Private
const getUserSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;
    // Get users not followed by current user and not the current user
    const suggestions = await User.find({
      _id: { $ne: currentUser._id, $nin: currentUser.following }
    }).select('name username profileImage').limit(5);

    res.json(suggestions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Follow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = req.user;

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    currentUser.following.push(req.params.id);
    await currentUser.save();

    // Create notification for the followed user
    await createNotification(
      req.params.id,
      req.user.id,
      'follow',
      `${req.user.name} started following you`
    );

    res.json({ msg: 'User followed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = req.user;

    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    await currentUser.save();

    res.json({ msg: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get followers of a user
// @route   GET /api/users/:id/followers
// @access  Private
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find users who have this user in their following list
    const followers = await User.find({
      following: req.params.id
    }).select('name username profileImage');

    res.json(followers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, title, bio, skills } = req.body;
    const updateData = { name, bio };

    if (skills) {
      updateData.skills = skills.split(',').map(skill => skill.trim());
    }

    if (req.files) {
      if (req.files.profileImage) {
        updateData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      }
      if (req.files.coverImage) {
        updateData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name username profileImage')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

export {
  registerUser,
  loginUser,
  getMe,
  getUserSuggestions,
  followUser,
  unfollowUser,
  getFollowers,
  updateProfile,
  searchUsers,
};
