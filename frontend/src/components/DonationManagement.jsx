import React, { useState, useEffect, useCallback } from 'react';
import { IndianRupee, Check, X, Clock } from 'lucide-react';
import './DonationManagement.css';

const DonationManagement = ({ adminPassword }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await fetch('https://stubits.onrender.com/api/donations/all', {
        headers: {
          'adminKey': adminPassword
        }
      });
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`https://stubits.onrender.com/api/donations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'adminKey': adminPassword
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchDonations();
      }
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  return (
    <div className="admin-component-content">
      <div className="admin-component-header">
        <div className="header-text">
          <h2>Manage Donations</h2>
          <p>Review and process incoming donations</p>
        </div>
      </div>

      <div className="donations-grid">
        {loading ? (
          <div className="loading-state">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="empty-state">No donations found</div>
        ) : (
          donations.map(donation => (
            <div key={donation._id} className={`donation-card ${donation.status}`}>
              <div className="donation-header">
                <h3>{donation.name}</h3>
                <div className={`status-badge ${donation.status}`}>
                  {donation.status === 'pending' ? (
                    <><Clock size={16} /> Pending</>
                  ) : donation.status === 'approved' ? (
                    <><Check size={16} /> Approved</>
                  ) : (
                    <><X size={16} /> Rejected</>
                  )}
                </div>
              </div>
              
              <div className="donation-details">
                <div className="detail-item">
                  <IndianRupee size={16} />
                  <span className="amount">₹{donation.amount}</span>
                </div>
                <div className="detail-item">
                  <span className="label">UPI ID:</span>
                  <span>{donation.upiId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span>{donation.email}</span>
                </div>
                {donation.message && (
                  <div className="message">
                    <p>{donation.message}</p>
                  </div>
                )}
              </div>

              {donation.status === 'pending' && (
                <div className="donation-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusUpdate(donation._id, 'approved')}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusUpdate(donation._id, 'rejected')}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonationManagement;