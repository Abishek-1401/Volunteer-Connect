import mongoose from 'mongoose';

// This is the blueprint (Schema) for our group data
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Group name must be at least 3 characters long'],
    maxlength: [100, 'Group name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true,
});

// This creates the model that we'll use to interact with the 'groups' collection
const Group = mongoose.model('Group', groupSchema);

export default Group;
