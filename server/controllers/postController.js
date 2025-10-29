// server/controllers/postController.js
import Post from '../models/postModel.js'; // Use require
import User from '../models/userModel.js'; // Use require
import { createNotification } from './notificationController.js';
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { content, image, fileUrl, fileName, fileType } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    const post = new Post({
      user: req.user.id, // User ID comes from the auth middleware
      content,
      image,
      fileUrl,
      fileName,
      fileType,
    });

    const createdPost = await post.save();

    // Create notifications for followers
    const author = await User.findById(req.user.id).populate('following');
    if (author.following && author.following.length > 0) {
      for (const follower of author.following) {
        await createNotification(
          follower._id,
          req.user.id,
          'post',
          `${req.user.name} created a new post`,
          createdPost._id
        );
      }
    }

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get all posts (for a feed)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    // Find posts, sort by newest, populate user info (excluding password)
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name profileImage'); // Fetch user's name and image

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    const alreadyLiked = post.likes.some(like => like.toString() === req.user.id);

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like the post
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// Add functions for updatePost, deletePost, addComment etc. following similar patterns

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  const { content, image, fileUrl, fileName, fileType } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields if provided
    post.content = content || post.content;
    post.image = image || post.image;
    post.fileUrl = fileUrl || post.fileUrl;
    post.fileName = fileName || post.fileName;
    post.fileType = fileType || post.fileType;

    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne(); // Use deleteOne() method
    res.json({ message: 'Post removed' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get posts by the current user
// @route   GET /api/posts/myposts
// @access  Private
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name profileImage');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: text,
      // name: req.user.name, // Optionally add user name/avatar here if needed
      // avatar: req.user.profileImage
    };

    post.comments.push(newComment); // Add comment to the beginning of the array

    await post.save();

    // Create notification for post author (if not self-commenting)
    if (post.user.toString() !== req.user.id) {
      await createNotification(
        post.user,
        req.user.id,
        'comment',
        `${req.user.name} commented on your post`,
        post._id,
        newComment._id
      );
    }

    // Optionally populate user info for the new comment before sending response
    const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name profileImage');

    res.status(201).json(updatedPost.comments);

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Private
const searchPosts = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Split query into keywords
    const keywords = q.split(/\s+/).filter(word => word.length > 0);

    // Create regex for each keyword
    const keywordRegexes = keywords.map(keyword => new RegExp(keyword, 'i'));

    const posts = await Post.find({
      $or: keywordRegexes.map(regex => ({ content: { $regex: regex } }))
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name profileImage')
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// Use module.exports at the bottom
export {
  createPost,
  getPosts,
  likePost,
  updatePost,
  deletePost,
  getMyPosts,
  addComment,
  searchPosts,
};
