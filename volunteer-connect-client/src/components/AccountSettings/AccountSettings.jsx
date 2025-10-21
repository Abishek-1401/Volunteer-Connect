import React from 'react';
import './AccountSettings.css';

const AccountSettings = ({ onDeactivate, onDelete }) => {
  return (
    <>
      <div className="settings-section">
        <h3>Deactivate Account</h3>
        <p>Deactivating your account is temporary. Your profile will be hidden until you log back in.</p>
        <button className="deactivate-btn" onClick={onDeactivate}>Deactivate Account</button>
      </div>
      <div className="settings-section danger-zone">
        <h3>Delete Account</h3>
        <p>Permanently delete your account and all of your content. This action cannot be undone.</p>
        <button className="delete-btn" onClick={onDelete}>Delete Account Permanently</button>
      </div>
    </>
  );
};
export default AccountSettings;