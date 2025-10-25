import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MessageInputForm.css';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import useClickOutside from '../../hooks/useClickOutside';
import { useToast } from '../../context/ToastContext';

const frequentEmojis = ['😀', '😂', '❤️', '👍', '🙏', '🔥', '😊', '🎉'];

const MessageInputForm = ({ placeholder, conversationId, onMessageSent }) => {
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const pickerRef = useRef(null);
  const { showToast } = useToast();

  useClickOutside(pickerRef, () => setShowPicker(false));

  const addEmoji = (emoji) => {
    setInputText(prevInput => prevInput + emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      console.log('Selected file:', e.target.files[0].name);
      // TODO: Implement file upload functionality
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

        <input 
          type="text" 
          name="message" 
          placeholder={placeholder || "Type Something..."} 
          autoComplete="off" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="send-btn"><FaPaperPlane /></button>
      </form>
    </div>
  );
};

export default MessageInputForm;