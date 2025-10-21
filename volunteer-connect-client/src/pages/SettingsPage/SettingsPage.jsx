import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import AccountSettings from '../../components/AccountSettings/AccountSettings';
import SecuritySettings from '../../components/SecuritySettings/SecuritySettings';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './SettingsPage.css';
import { useToast } from '../../context/ToastContext';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'deactivate' or 'delete'
  const { showToast } = useToast();

  const handleConfirm = () => {
    if (modalAction === 'deactivate') {
      console.log("Deactivating account...");
      showToast("Account deactivated.", "info");
    }
    if (modalAction === 'delete') {
      console.log("DELETING ACCOUNT...");
      showToast("Account permanently deleted.", "error");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="settings-page">
      <div className="navbar-wrapper"><Navbar /></div>
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalAction === 'delete' ? 'Delete Account' : 'Deactivate Account'}
        message={modalAction === 'delete' ? 'This action is irreversible. All your data will be lost.' : 'Are you sure you want to deactivate your account?'}
        confirmText={modalAction === 'delete' ? 'DELETE' : 'DEACTIVATE'}
      />
      <main className="settings-container">
        <h1>Settings</h1>
        <div className="settings-layout">
          <aside className="settings-nav">
            <button className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>Account</button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security</button>
            <button>Logout</button>
          </aside>
          <div className="settings-content">
            {activeTab === 'account' && (
              <AccountSettings 
                onDeactivate={() => { setModalAction('deactivate'); setIsModalOpen(true); }}
                onDelete={() => { setModalAction('delete'); setIsModalOpen(true); }}
              />
            )}
            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;