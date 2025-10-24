import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
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
        name: msg.sender.name,
        avatar: `https://randomuser.me/api/portraits/${msg.sender.name.includes(' ') ? 'women' : 'men'}/1.jpg`,
      },
      text: msg.content,
      timestamp: msg.createdAt,
      messageType: msg.messageType,
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
    const { conversationId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    // Verify user is participant in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      content,
      messageType,
    });

    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    // Populate sender info
    await message.populate('sender', 'name username');

    // Format for frontend
    const formattedMessage = {
      id: message._id,
      sender: {
        name: message.sender.name,
        avatar: `https://randomuser.me/api/portraits/${message.sender.name.includes(' ') ? 'women' : 'men'}/1.jpg`,
      },
      text: message.content,
      timestamp: message.createdAt,
      messageType: message.messageType,
    };

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
