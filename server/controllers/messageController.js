import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    let { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Handle following- prefixed conversation IDs (find existing conversation)
    let conversation;
    if (conversationId.startsWith('following-')) {
      const targetUserId = conversationId.replace('following-', '');

      // Find existing conversation between users
      conversation = await Conversation.findOne({
        type: 'dm',
        participants: { $all: [userId, targetUserId] }
      });

      if (!conversation) {
        // No conversation exists yet, return empty messages
        return res.json([]);
      }

      conversationId = conversation._id;
    } else {
      // Verify user is participant in existing conversation
      conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
      });

      if (!conversation) {
        return res.status(404).json({ msg: 'Conversation not found' });
      }
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Format messages for frontend
    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      sender: {
        id: msg.sender._id,
        name: msg.sender.name,
        avatar: msg.sender.profileImage || '/assets/default-avatar.png',
      },
      text: msg.content,
      timestamp: msg.createdAt,
      messageType: msg.messageType,
      fileName: msg.fileName,
      isFromCurrentUser: msg.sender._id.toString() === userId.toString(),
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    let { conversationId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    console.log('Original conversationId:', conversationId);
    console.log('Starts with following-:', conversationId.startsWith('following-'));

    // Handle following- prefixed conversation IDs (create new conversation)
    let conversation;
    if (conversationId.startsWith('following-')) {
      const targetUserId = conversationId.replace('following-', '');

      // Check if conversation already exists
      conversation = await Conversation.findOne({
        type: 'dm',
        participants: { $all: [userId, targetUserId] }
      });

      if (!conversation) {
        // Create new conversation
        conversation = new Conversation({
          type: 'dm',
          participants: [userId, targetUserId],
          createdBy: userId,
        });
        await conversation.save();
      }

      conversationId = conversation._id;
    } else {
      // Verify user is participant in existing conversation
      conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
      });

      if (!conversation) {
        return res.status(404).json({ msg: 'Conversation not found' });
      }
    }

    let messageContent = content;
    let finalMessageType = messageType;

    // Handle file uploads
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      messageContent = req.file.mimetype.startsWith('image/') ? fileUrl : fileUrl;
      finalMessageType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      content: messageContent,
      messageType: finalMessageType,
      fileName: req.file ? req.file.originalname : null,
    });

    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    // Populate sender info
    await message.populate('sender', 'name username profileImage');

    // Format for frontend
    const formattedMessage = {
      id: message._id,
      sender: {
        id: message.sender._id,
        name: message.sender.name,
        avatar: message.sender.profileImage || '/assets/default-avatar.png',
      },
      text: message.content,
      timestamp: message.createdAt,
      messageType: message.messageType,
      isFromCurrentUser: message.sender._id.toString() === userId.toString(),
      fileName: req.file ? req.file.originalname : null,
    };

    // Emit the message to all users in the conversation via Socket.IO
    const io = req.app.get('io');
    io.to(conversationId).emit('receiveMessage', formattedMessage);

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId } },
      {
        $addToSet: {
          readBy: { user: userId, readAt: new Date() }
        }
      }
    );

    res.json({ msg: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
