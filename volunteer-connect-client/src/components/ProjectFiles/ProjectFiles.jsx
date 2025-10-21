import React from 'react';
import './ProjectFiles.css';
import { FaFilePdf, FaFileImage, FaDownload } from 'react-icons/fa';

const ProjectFiles = ({ files }) => {
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FaFilePdf className="file-icon pdf" />;
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) return <FaFileImage className="file-icon image" />;
    return null;
  };

  return (
    <div className="project-files-container">
      {files.map((file, index) => (
        <div key={index} className="file-item">
          {getFileIcon(file.name)}
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-meta">Uploaded by {file.uploader} - {file.size}</span>
          </div>
          <button className="download-btn"><FaDownload /></button>
        </div>
      ))}
    </div>
  );
};

export default ProjectFiles;