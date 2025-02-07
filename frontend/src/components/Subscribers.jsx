import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "./Subscribers.css";

const Subscribers = ({ isAdminAuthenticated, adminPassword }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!isAdminAuthenticated) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/subscribers?password=${adminPassword}`
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
    };

    fetchSubscribers();
  }, [isAdminAuthenticated, adminPassword]);

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="subscribers-section">
      <div className="subscribers-content">
        <h1>
          Early Access <span className="gradient-text">Subscribers</span>
        </h1>

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
  );
};

export default Subscribers;