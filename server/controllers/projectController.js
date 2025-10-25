import Project from '../models/projectModel.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('organizer', 'name username')
      .populate('participants', 'name username')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('organizer', 'name username')
      .populate('participants', 'name username');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { title, description, tags, location, eventDate } = req.body;

  try {
    // Create new project with the logged-in user as organizer and first participant
    const project = new Project({
      title,
      description,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
      location,
      eventDate,
      organizer: req.user.id,
      participants: [req.user.id],
    });

    await project.save();

    // Populate the organizer and participants fields for the response
    const populatedProject = await Project.findById(project._id)
      .populate('organizer', 'name username')
      .populate('participants', 'name username');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Join a project
// @route   PUT /api/projects/:id/join
// @access  Private
const joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if project is open
    if (project.status !== 'open') {
      return res.status(400).json({ msg: 'Project is closed' });
    }

    // Check if user is already a participant
    if (project.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already a participant in this project' });
    }

    project.participants.push(req.user.id);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('organizer', 'name username')
      .populate('participants', 'name username');

    res.json(populatedProject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Leave a project
// @route   PUT /api/projects/:id/leave
// @access  Private
const leaveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is a participant
    if (!project.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Not a participant in this project' });
    }

    // Organizer cannot leave the project
    if (project.organizer.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Organizer cannot leave the project' });
    }

    project.participants = project.participants.filter(participant => participant.toString() !== req.user.id);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('organizer', 'name username')
      .populate('participants', 'name username');

    res.json(populatedProject);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Private
const searchProjects = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const projects = await Project.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .populate('organizer', 'name username')
      .populate('participants', 'name username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

export {
  getAllProjects,
  getProjectById,
  createProject,
  joinProject,
  leaveProject,
  searchProjects,
};
