import React, { useState, useEffect } from 'react';
import { FileText, Clock, Book, Calendar, CreditCard } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('https://stubits.onrender.com/api/payments/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      // Filter out purchases with null materialId
      const validPurchases = data.filter(purchase => purchase.materialId !== null);
      setPurchases(validPurchases);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const renderPurchaseCard = (purchase) => {
    // Add null check for purchase and its properties
    if (!purchase || !purchase.materialId) {
      return null;
    }

    return (
      <div key={purchase._id} className={`purchase-card ${purchase.status}`}>
        <div className="purchase-header">
          <h3>{purchase.materialId.title}</h3>
          <div className={`status-badge ${purchase.status}`}>
            {purchase.status === 'pending' ? (
              <><Clock size={16} /> Pending</>
            ) : purchase.status === 'approved' ? (
              <><FileText size={16} /> Available</>
            ) : (
              <><Clock size={16} /> Rejected</>
            )}
          </div>
        </div>
        
        <div className="purchase-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{new Date(purchase.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</span>
          </div>
          <div className="detail-item">
            <CreditCard size={16} />
            <span>₹{purchase.amount}</span>
          </div>
          <div className="detail-item">
            <FileText size={16} />
            <span>{purchase.userUpi}</span>
          </div>
        </div>
        
        {purchase.status === 'approved' && purchase.materialId.fileUrl && (
          <button 
            className="access-btn"
            onClick={() => window.open(purchase.materialId.fileUrl, '_blank')}
          >
            View Notes
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Study Materials</h1>
        <p className="dashboard-subtitle">Manage your purchased materials and track their status</p>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-state">
          <Book size={48} className="empty-icon" />
          <h3>No Materials Yet</h3>
          <p>You haven't purchased any study materials yet.</p>
          <a href="/study-materials" className="browse-btn">Browse Materials</a>
        </div>
      ) : (
        <div className="purchases-grid">
          {purchases.map(purchase => renderPurchaseCard(purchase))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;