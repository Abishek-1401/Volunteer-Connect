import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name username')
    .populate('lastMessage')
    .populate('createdBy', 'name username')
    .sort({ updatedAt: -1 });

    // Format conversations for frontend
    const formattedConversations = conversations.map(convo => ({
      id: convo._id,
      type: convo.type,
      name: convo.type === 'dm'
        ? convo.participants.find(p => p._id.toString() !== userId)?.name || 'Unknown User'
        : convo.name,
      avatar: convo.type === 'dm'
        ? `https://randomuser.me/api/portraits/${convo.participants.find(p => p._id.toString() !== userId)?.name ? 'men' : 'women'}/1.jpg`
        : null,
      lastMessage: convo.lastMessage?.content || 'No messages yet',
      time: convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
      online: false, // TODO: Implement online status
      participants: convo.participants,
    }));

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new conversation (DM or Group)
export const createConversation = async (req, res) => {
  try {
    const { type, participants, name, isGroup } = req.body;
    const userId = req.user.id;

    // Handle different request formats
    let participantIds = [];
    if (Array.isArray(participants)) {
      participantIds = participants;
    } else if (participants && typeof participants === 'string') {
      participantIds = [participants];
    } else if (req.body.participantIds) {
      participantIds = req.body.participantIds;
    }

    // Ensure participantIds is an array
    if (!Array.isArray(participantIds)) {
      participantIds = [];
    }



    // Determine conversation type
    const convoType = type || (isGroup ? 'group' : 'dm');

    if (convoType === 'dm' && participantIds.length > 0) {
      // Check if DM already exists
      const existingDM = await Conversation.findOne({
        type: 'dm',
        participants: { $all: [userId, participantIds[0]], $size: 2 }
      });

      if (existingDM) {
        return res.json(existingDM);
      }
    }

    const conversation = new Conversation({
      type: convoType,
      name: convoType === 'group' ? name : undefined,
      participants: [userId, ...participantIds].filter(id => id), // Filter out any falsy values
      createdBy: userId,
    });

    await conversation.save();

    const populatedConvo = await Conversation.findById(conversation._id)
      .populate('participants', 'name username')
      .populate('createdBy', 'name username');

    res.status(201).json(populatedConvo);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get conversation details
export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    })
    .populate('participants', 'name username')
    .populate('createdBy', 'name username');

    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
