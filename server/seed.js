import mongoose from 'mongoose';
import User from './models/userModel.js';
import Conversation from './models/conversationModel.js';
import Message from './models/messageModel.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/volunteer-connect');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();

    // Create users
    const users = await User.create([
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Volunteer and developer',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Community organizer',
        skills: ['Project Management', 'Communication']
      },
      {
        name: 'Bob Johnson',
        username: 'bobjohnson',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Designer and volunteer',
        skills: ['UI/UX Design', 'Graphic Design']
      }
    ]);

    console.log('Users created:', users.length);

    // Make users follow each other
    const user1 = users[0];
    const user2 = users[1];
    const user3 = users[2];

    user1.following.push(user2._id, user3._id);
    user2.following.push(user1._id, user3._id);
    user3.following.push(user1._id, user2._id);

    await user1.save();
    await user2.save();
    await user3.save();

    console.log('Following relationships created');

    // Create conversations
    const convo1 = await Conversation.create({
      type: 'dm',
      participants: [user1._id, user2._id],
      createdBy: user1._id
    });

    const convo2 = await Conversation.create({
      type: 'dm',
      participants: [user1._id, user3._id],
      createdBy: user1._id
    });

    const convo3 = await Conversation.create({
      type: 'group',
      name: 'Volunteer Team',
      participants: [user1._id, user2._id, user3._id],
      createdBy: user1._id
    });

    console.log('Conversations created:', 3);

    // Create messages
    const messages = await Message.create([
      {
        conversation: convo1._id,
        sender: user1._id,
        content: 'Hey Jane, how are you?',
        readBy: [user1._id]
      },
      {
        conversation: convo1._id,
        sender: user2._id,
        content: 'Hi John! I\'m doing great. Ready for the volunteer event?',
        readBy: [user1._id, user2._id]
      },
      {
        conversation: convo2._id,
        sender: user1._id,
        content: 'Bob, check out this new project idea!',
        readBy: [user1._id]
      },
      {
        conversation: convo3._id,
        sender: user1._id,
        content: 'Welcome to our volunteer team chat!',
        readBy: [user1._id]
      },
      {
        conversation: convo3._id,
        sender: user2._id,
        content: 'Thanks John! Excited to work together.',
        readBy: [user1._id, user2._id]
      }
    ]);

    // Update conversations with last message
    convo1.lastMessage = messages[1]._id;
    convo2.lastMessage = messages[2]._id;
    convo3.lastMessage = messages[4]._id;

    await convo1.save();
    await convo2.save();
    await convo3.save();

    console.log('Messages created:', messages.length);
    console.log('Seeding completed successfully!');
    console.log('Login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    console.log('Email: bob@example.com, Password: password123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit();
  }
};

connectDB().then(() => {
  seedData();
});
