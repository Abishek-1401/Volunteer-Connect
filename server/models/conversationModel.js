import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['dm', 'group'],
    required: true,
  },
  name: {
    type: String,
    required: function() { return this.type === 'group'; },
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
