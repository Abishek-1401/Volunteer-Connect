import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Link to the User model
    required: true,
    ref: 'User', // Reference to the 'User' collection
  },
  content: {
    type: String,
    required: [true, 'Post content cannot be empty'],
    trim: true,
  },
  image: {
    type: String, // URL to the image (if any)
  },
  fileUrl: {
    type: String, // URL to the uploaded file (if any)
  },
  fileName: {
    type: String, // Original name of the uploaded file
  },
  fileType: {
    type: String, // 'image' or 'file'
    enum: ['image', 'file'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Post = mongoose.model('Post', postSchema);

export default Post;