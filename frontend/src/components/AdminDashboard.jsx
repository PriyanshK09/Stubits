// frontend/src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { Book, Upload, Settings as SettingsIcon, Users, LogOut, CreditCard, LineChart, Heart } from 'lucide-react';
import './AdminDashboard.css';
import ManageNotes from './ManageNotes';
import Subscribers from './Subscribers';
import UploadMaterial from './UploadMaterial';
import PaymentManagement from './PaymentManagement';
import SettingsComponent from './Settings';
import Performance from './Performance';
import DonationManagement from './DonationManagement';

const AdminDashboard = ({ setIsAdmin }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editData, setEditData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://stubits.onrender.com/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Connection failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-form">
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
            <button type="submit">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <Book />
            <span>Manage Notes</span>
          </button>
          <button
            className={`nav-item ${
              activeTab === "subscribers" ? "active" : ""
            }`}
            onClick={() => setActiveTab("subscribers")}
          >
            <Users />
            <span>Subscribers</span>
          </button>
          <button
            className={`nav-item ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload />
            <span>Upload Material</span>
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>
          <button
            className={`nav-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard />
            <span>Payments</span>
          </button>
          <button
            className={`nav-item ${
              activeTab === "performance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("performance")}
          >
            <LineChart />
            <span>Performance</span>
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </button>
          <button
            className={`nav-item ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            <Heart />
            <span>Donations</span>
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === "notes" && (
          <ManageNotes
            adminPassword={password}
            setActiveTab={setActiveTab}
            setEditData={setEditData}
          />
        )}
        {activeTab === "upload" && (
          <UploadMaterial
            adminPassword={password}
            editData={editData}
            setEditData={setEditData}
            setActiveTab={setActiveTab} // Add this prop
          />
        )}
        {activeTab === "subscribers" && (
          <Subscribers isAdminAuthenticated={true} adminPassword={password} />
        )}
        {activeTab === "settings" && (
          <div className="settings-wrapper">
            <SettingsComponent admintoken={password} />
          </div>
        )}
        {activeTab === "payments" && (
          <PaymentManagement adminPassword={password} />
        )}
        {activeTab === "performance" && (
          <Performance adminPassword={password} />
        )}
        {activeTab === "donations" && (
          <DonationManagement adminPassword={password} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;