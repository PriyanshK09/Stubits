import React, { useState, useEffect } from 'react';
import { FileText, Clock, Book, Calendar, CreditCard, Upload } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const handleScreenshotUpload = async (paymentId) => {
    if (!uploadedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('screenshot', uploadedFile);

      const response = await fetch(`https://stubits.onrender.com/api/payments/${paymentId}/screenshot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: formData
      });

      if (response.ok) {
        setShowUploadModal(false);
        setUploadedFile(null);
        fetchPurchases(); // Refresh purchases
        alert('Screenshot uploaded successfully!');
      } else {
        throw new Error('Failed to upload screenshot');
      }
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      alert('Failed to upload screenshot. Please try again.');
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

        {purchase.status === 'pending' && (
          <div className="speed-up-process">
            <button 
              className="speed-up-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedPaymentId(purchase._id);
                setShowUploadModal(true);
              }}
            >
              <Upload size={14} />
              Want to speed up the process? Click Here
            </button>
          </div>
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

      {showUploadModal && (
        <div className="screenshot-modal" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Upload Payment Screenshot</h3>
            <p>Please upload a clear screenshot of your payment</p>
            
            <div className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="upload-btn"
                onClick={() => handleScreenshotUpload(selectedPaymentId)}
                disabled={!uploadedFile}
              >
                Upload Screenshot
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;