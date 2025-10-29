import React from 'react';
import './ImageModal.css';

const ImageModal = ({ imageSrc, alt, onClose }) => {
  if (!imageSrc) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>×</button>
        <img src={imageSrc} alt={alt} className="image-modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;
