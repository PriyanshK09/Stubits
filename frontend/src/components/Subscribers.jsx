import React, { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw } from "lucide-react";
import "./Subscribers.css";

const Subscribers = ({ isAdminAuthenticated, adminPassword }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = useCallback(async () => {
    if (!isAdminAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://stubits.onrender.com/api/subscribers?password=${adminPassword}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch subscribers");
      }
    } catch (err) {
      setError("Failed to fetch subscribers");
    } finally {
      setIsLoading(false);
    }
  }, [isAdminAuthenticated, adminPassword]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleRefresh = () => {
    fetchSubscribers();
  };

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-component-content">
      <div className="admin-component-header">
        <div className="header-text">
          <h2>Subscriber Management</h2>
          <p>View and manage newsletter subscribers</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={18} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="subscribers-section">
        <div className="subscribers-content">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{subscribers.length}</span>
              <span className="stat-label">Total Subscribers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {new Date().toLocaleDateString()}
              </span>
              <span className="stat-label">Last Updated</span>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">Loading subscribers...</div>
          ) : (
            <div className="subscribers-list">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber._id} className="subscriber-card">
                  <div className="subscriber-info">
                    <span className="subscriber-email">{subscriber.email}</span>
                    <span className="subscriber-date">
                      Joined: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribers;