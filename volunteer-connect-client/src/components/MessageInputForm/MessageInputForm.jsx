import React, { useState, useRef } from 'react';
import './MessageInputForm.css';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';
import useClickOutside from '../../hooks/useClickOutside';

const frequentEmojis = ['😀', '😂', '❤️', '👍', '🙏', '🔥', '😊', '🎉'];

const MessageInputForm = ({ placeholder }) => {
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useClickOutside(pickerRef, () => setShowPicker(false));

  const addEmoji = (emoji) => {
    setInputText(prevInput => prevInput + emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      console.log('Selected file:', e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      console.log("New message:", inputText);
      setInputText('');
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