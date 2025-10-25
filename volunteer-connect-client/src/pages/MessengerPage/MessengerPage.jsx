import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import ConversationList from '../../components/ConversationList/ConversationList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ChatInfoPanel from '../../components/ChatInfoPanel/ChatInfoPanel';
import { useToast } from '../../context/ToastContext';
import './MessengerPage.css';

const MessengerPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { showToast } = useToast();

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConvoId) {
      fetchMessages(selectedConvoId);
    }
  }, [selectedConvoId]);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/conversations');
      setConversations(data);
      if (data.length > 0 && !selectedConvoId) {
        // Select the first conversation that's not a following suggestion
        const firstRealConvo = data.find(convo => !convo.isFollowingSuggestion);
        if (firstRealConvo) {
          setSelectedConvoId(firstRealConvo.id);
        } else if (data[0]) {
          setSelectedConvoId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      showToast('Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    setMessagesLoading(true);
    try {
      const { data } = await axios.get(`/api/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showToast('Failed to load messages', 'error');
    } finally {
      setMessagesLoading(false);
    }
  };

  const selectedConvo = conversations.find(c => c.id === selectedConvoId);

  // Add real-time message updates
  useEffect(() => {
    if (selectedConvoId) {
      // Poll for new messages every 2 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConvoId);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedConvoId]);

  const mockInfo = selectedConvo ? {
    type: selectedConvo.type,
    name: selectedConvo.name,
    avatar: selectedConvo.avatar,
    description: selectedConvo.type === 'group' ? 'Group conversation' : 'Direct message',
    members: selectedConvo.type === 'group' ? [{ name: 'You' }, { name: 'Other Members' }] : []
  } : null;

  if (loading) {
    return (
      <div className="messenger-page-new">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="messenger-container-new">
          <div className="loading">Loading conversations...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="messenger-page-new">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="messenger-container-new">
        <ConversationList
          conversations={conversations}
          selectedConvoId={selectedConvoId}
          onConvoClick={(id) => setSelectedConvoId(id)}
        />
        <ChatWindow
          conversation={selectedConvo}
          messages={messagesLoading ? [] : messages}
          isLoading={messagesLoading}
          onMessageSent={(newMessage) => setMessages(prev => [...prev, newMessage])}
        />
        <ChatInfoPanel
          info={mockInfo}
        />
      </main>
    </div>
  );
};

export default MessengerPage;