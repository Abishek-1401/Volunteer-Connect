import mongoose from 'mongoose';

// This is the blueprint (Schema) for our project data
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Project title must be at least 3 characters long'],
    maxlength: [100, 'Project title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  location: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
}, {
  // This automatically adds `createdAt` and `updatedAt` fields
  timestamps: true,
});

// This creates the model that we'll use to interact with the 'projects' collection
const Project = mongoose.model('Project', projectSchema);

export default Project;
