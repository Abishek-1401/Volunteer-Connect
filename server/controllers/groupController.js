import Group from '../models/groupModel.js';

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate('admin', 'name username')
      .populate('members', 'name username')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
// @access  Public
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name username')
      .populate('members', 'name username');

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = async (req, res) => {
  const { name, description, privacy } = req.body;

  try {
    // Create new group with the logged-in user as admin and first member
    const group = new Group({
      name,
      description,
      privacy: privacy || 'public',
      admin: req.user.id,
      members: [req.user.id],
    });

    await group.save();

    // Populate the admin and members fields for the response
    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'name username')
      .populate('members', 'name username');

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Join a group
// @route   PUT /api/groups/:id/join
// @access  Private
const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already a member of this group' });
    }

    group.members.push(req.user.id);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'name username')
      .populate('members', 'name username');

    res.json(populatedGroup);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Leave a group
// @route   PUT /api/groups/:id/leave
// @access  Private
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Not a member of this group' });
    }

    // Admin cannot leave the group
    if (group.admin.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Admin cannot leave the group' });
    }

    group.members = group.members.filter(member => member.toString() !== req.user.id);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'name username')
      .populate('members', 'name username');

    res.json(populatedGroup);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get group suggestions
// @route   GET /api/groups/suggestions
// @access  Private
const getGroupSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;
    // Get groups where user is not a member
    const suggestions = await Group.find({
      members: { $ne: currentUser._id }
    }).select('name description').limit(5);

    res.json(suggestions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add member to group (admin only)
// @route   PUT /api/groups/:id/add-member
// @access  Private
const addMemberToGroup = async (req, res) => {
  const { userId } = req.body;

  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if current user is admin
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only admin can add members' });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    group.members.push(userId);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('admin', 'name username')
      .populate('members', 'name username');

    res.json(populatedGroup);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Search groups
// @route   GET /api/groups/search
// @access  Private
const searchGroups = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const groups = await Group.find({
      name: { $regex: q, $options: 'i' }
    })
      .populate('admin', 'name username')
      .populate('members', 'name username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

export {
  getAllGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupSuggestions,
  addMemberToGroup,
  searchGroups,
};
