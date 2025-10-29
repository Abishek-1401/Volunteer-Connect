import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import './MessageInputForm.css';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import useClickOutside from '../../hooks/useClickOutside';
import { useToast } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';

const frequentEmojis = ['😀', '😂', '❤️', '👍', '🙏', '🔥', '😊', '🎉'];

const MessageInputForm = ({ placeholder, conversationId, onMessageSent }) => {
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const pickerRef = useRef(null);
  const { showToast } = useToast();
  const { socket, user } = useContext(AuthContext);

  useClickOutside(pickerRef, () => setShowPicker(false));

  const addEmoji = (emoji) => {
    setInputText(prevInput => prevInput + emoji);
  };

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('Selected file:', file.name);

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip', 'application/x-rar-compressed'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Allowed types: images, PDF, DOC, DOCX, TXT, ZIP, RAR', 'error');
        return;
      }

      // Show file preview popup
      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : null;

      const confirmUpload = window.confirm(
        `${isImage ? 'Image' : 'Document'} selected: ${file.name}\nSize: ${(file.size / 1024 / 1024).toFixed(2)} MB\n\n${isImage ? 'Preview will be shown in chat.' : 'File will be downloadable in chat.'}\n\nUpload this file?`
      );

      if (!confirmUpload) {
        // Reset file input
        e.target.value = '';
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setSending(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post(`/api/messages/${conversationId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (onMessageSent) {
          onMessageSent(data);
        }
        showToast(`${isImage ? 'Image' : 'File'} uploaded successfully`, 'success');
      } catch (error) {
        console.error('Error uploading file:', error);
        showToast('Failed to upload file', 'error');
      } finally {
        setSending(false);
        // Reset file input
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() && !sending && conversationId) {
      setSending(true);
      try {
        const { data } = await axios.post(`/api/messages/${conversationId}`, {
          content: inputText.trim()
        });
        setInputText('');
        if (onMessageSent) {
          onMessageSent(data);
        }
        // Emit the message via socket
        if (socket) {
          socket.emit('sendMessage', {
            conversationId,
            message: data,
            sender: user
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message', 'error');
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="message-input-container" ref={pickerRef}>
      {showPicker && (
        <div className="custom-emoji-picker">
          {frequentEmojis.map(emoji => (
            <button key={emoji} type="button" onClick={() => addEmoji(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}
      <form className="message-input-form-new" onSubmit={handleSubmit}>
        <label htmlFor="file-upload-button" className="icon-button">
          <FaPaperclip />
        </label>
        <input id="file-upload-button" type="file" onChange={handleFileChange} style={{ display: 'none' }} />

        <button type="button" className="icon-button" onClick={() => setShowPicker(!showPicker)}>
          <FaSmile />
        </button>

        <textarea
          name="message"
          placeholder={placeholder || "Type Something..."}
          autoComplete="off"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows="1"
          style={{ resize: 'none', overflow: 'hidden' }}
        />
        <button type="submit" className="send-btn"><FaPaperPlane /></button>
      </form>
    </div>
  );
};

export default MessageInputForm;