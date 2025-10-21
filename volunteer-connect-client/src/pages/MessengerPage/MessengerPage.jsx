import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ConversationList from '../../components/ConversationList/ConversationList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ChatInfoPanel from '../../components/ChatInfoPanel/ChatInfoPanel';
import './MessengerPage.css';

// --- Upgraded Mock Data ---
const mockConversations = [
  { id: '1', type: 'dm', name: 'Eleanor Pena', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', lastMessage: 'Hey, are you free this weekend?', time: '15:16', online: true },
  { id: '2', type: 'group', name: 'Beach Cleanup Crew', lastMessage: 'You: I\'ll be there!', time: '12:30', online: false },
  { id: '3', type: 'dm', name: 'Cody Fisher', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', lastMessage: 'Thanks for the help last week!', time: 'Yesterday', online: false },
  { id: '4', type: 'group', name: 'Local Food Bank', lastMessage: 'Jane Doe: We need volunteers...', time: 'Yesterday', online: false },
];

const mockMessages = {
  '1': [{ sender: { name: 'Eleanor Pena', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }, text: 'Hey, are you free this weekend for the community garden event?' }],
  '2': [
    { sender: { name: 'Cody Fisher', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, text: 'Team, the next cleanup is scheduled for Saturday at 9 AM.' },
    { sender: { name: 'You', avatar: null }, text: 'I\'ll be there! Should I bring anything?' },
  ],
};

const mockInfo = {
    '1': { type: 'dm', name: 'Eleanor Pena', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', description: 'Community Organizer' },
    '2': { type: 'group', name: 'Beach Cleanup Crew', description: 'Cleaning up our shores, one beach at a time.', members: [{ name: 'You' }, { name: 'Cody Fisher' }, { name: 'Jane Doe' }] },
}

const MessengerPage = () => {
  const [selectedConvoId, setSelectedConvoId] = useState('2');
  const selectedConvo = mockConversations.find(c => c.id === selectedConvoId);

  return (
    <div className="messenger-page-new">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="messenger-container-new">
        <ConversationList
          conversations={mockConversations}
          selectedConvoId={selectedConvoId}
          onConvoClick={(id) => setSelectedConvoId(id)}
        />
        <ChatWindow
          conversation={selectedConvo}
          messages={mockMessages[selectedConvoId] || []}
        />
        <ChatInfoPanel
            info={mockInfo[selectedConvoId]}
        />
      </main>
    </div>
  );
};

export default MessengerPage;