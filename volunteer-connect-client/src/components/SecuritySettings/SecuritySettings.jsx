import React from 'react';
import './SecuritySettings.css';

const SecuritySettings = () => {
  return (
    <div className="settings-section">
      <h3>Change Password</h3>
      <form className="settings-form">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" />
        </div>
        <button type="submit" className="save-btn">Update Password</button>
      </form>
    </div>
  );
};
export default SecuritySettings;