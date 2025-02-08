import React, { useState } from 'react';
import { KeyRound, Save, User, Mail } from 'lucide-react';
import './Settings.css';

const Settings = ({ admintoken }) => { // Changed from adminToken
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://stubits.onrender.com/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'adminKey': admintoken // Changed from adminToken
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Password updated successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        localStorage.setItem('adminToken', newPassword);
      } else {
        setMessage({ text: data.message || 'Failed to update password', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Connection failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-component-content">
      <div className="admin-component-header">
        <div className="header-text">
          <h2>Platform Settings</h2>
          <p>Manage admin access and platform configuration</p>
        </div>
      </div>
      <div className="settings-container">
        <div className="settings-grid">
          <div className="settings-card">
            <div className="settings-card-header">
              <KeyRound className="settings-icon" />
              <h2>Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" className="settings-btn" disabled={loading}>
                <Save size={18} />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <User className="settings-icon" />
              <h2>Admin Profile</h2>
            </div>
            <div className="profile-info">
              <div className="info-item">
                <Mail className="info-icon" />
                <span>welcome@stubits.com</span>
              </div>
              <div className="info-item">
                <User className="info-icon" />
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;