import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's following list
    const user = await User.findById(userId).select('following');
    const followingIds = user.following.map(id => id.toString());

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name username profileImage')
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
        ? convo.participants.find(p => p._id.toString() !== userId)?.profileImage || '/assets/default-avatar.png'
        : null,
      lastMessage: convo.lastMessage?.content || 'No messages yet',
      time: convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
      online: false, // TODO: Implement online status
      participants: convo.participants,
    }));

    // Add following users who don't have conversations yet
    const existingConvoUserIds = conversations.flatMap(convo =>
      convo.participants.filter(p => p._id.toString() !== userId).map(p => p._id.toString())
    );

    const followingWithoutConversations = followingIds.filter(id => !existingConvoUserIds.includes(id));

    if (followingWithoutConversations.length > 0) {
      const followingUsers = await User.find({
        _id: { $in: followingWithoutConversations }
      }).select('name username profileImage');

      const followingConversations = followingUsers.map(user => ({
        id: `following-${user._id}`,
        type: 'dm',
        name: user.name,
        avatar: user.profileImage || '/assets/default-avatar.png',
        lastMessage: 'Start a conversation',
        time: '',
        online: false,
        participants: [user],
        isFollowingSuggestion: true,
      }));

      formattedConversations.push(...followingConversations);
    }

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
