import React, { useState } from "react";
import { Search } from "lucide-react";
import "./Subscribers.css";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Changed to false by default
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true); // Set loading only when fetching
      const response = await fetch(
        `https://stubits.onrender.com/api/subscribers?password=${password}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data);
        setIsAuthenticated(true);
        setError(null); // Clear any previous errors
      } else {
        setError(data.message || "Invalid password");
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError("Failed to fetch subscribers");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return; // Prevent empty submissions
    fetchSubscribers();
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="subscribers-container">
        <div className="auth-form">
          <h2>Authentication Required</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !password.trim()}>
              {isLoading ? "Verifying..." : "Access List"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="subscribers-container">
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
      </div>
    </div>
  );
};

export default Subscribers;