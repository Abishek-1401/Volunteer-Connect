import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateGroupModal.css';
import { FaTimes, FaUserPlus, FaCheck } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchUsers = async () => {
        setSearching(true);
        try {
          const { data } = await axios.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
          setUsers(data);
        } catch (error) {
          console.error('Error searching users:', error);
          showToast('Failed to search users', 'error');
        } finally {
          setSearching(false);
        }
      };

      const debounceTimer = setTimeout(searchUsers, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setUsers([]);
    }
  }, [searchQuery, showToast]);

  const handleUserSelect = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      showToast('Please enter a group name', 'error');
      return;
    }

    if (selectedUsers.length === 0) {
      showToast('Please select at least one user', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/conversations/group', {
        type: 'group',
        name: groupName.trim(),
        participants: selectedUsers.map(u => u._id)
      });

      showToast('Group created successfully', 'success');
      onGroupCreated(data);
      onClose();
      setGroupName('');
      setSearchQuery('');
      setSelectedUsers([]);
      setUsers([]);
    } catch (error) {
      console.error('Error creating group:', error);
      showToast('Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSearchQuery('');
    setSelectedUsers([]);
    setUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content create-group-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Group</h3>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="group-name">Group Name</label>
            <input
              id="group-name"
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label>Add Members</label>
            <input
              type="text"
              placeholder="Search users to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searching && <div className="searching">Searching...</div>}

            {users.length > 0 && (
              <div className="user-list">
                {users.map(user => (
                  <div
                    key={user._id}
                    className={`user-item ${selectedUsers.find(u => u._id === user._id) ? 'selected' : ''}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    {selectedUsers.find(u => u._id === user._id) && (
                      <FaCheck className="check-icon" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedUsers.length > 0 && (
              <div className="selected-users">
                <h4>Selected Members ({selectedUsers.length})</h4>
                <div className="selected-list">
                  {selectedUsers.map(user => (
                    <div key={user._id} className="selected-user">
                      <img src={user.avatar} alt={user.name} className="user-avatar-small" />
                      <span>{user.name}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleUserSelect(user)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={handleCreateGroup}
            disabled={loading || !groupName.trim() || selectedUsers.length === 0}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
