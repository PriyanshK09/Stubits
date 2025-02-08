// frontend/src/components/PaymentGateway.jsx
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import './PaymentGateway.css';

const PaymentGateway = ({ material, onClose, onSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userUpi, setUserUpi] = useState('');
  const UPI_ID = "payment@stubits"; // Example UPI ID

  const handlePayment = async () => {
    if (!userUpi) {
      alert('Please enter your UPI ID');
      return;
    }
    setIsPaying(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          materialId: material._id,
          amount: material.price,
          userUpi: userUpi
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }
      
      // Remove unused data variable
      await response.json();
      setPaymentStatus('pending');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="payment-content">
          {paymentStatus === 'pending' ? (
            <div className="payment-status">
              <RefreshCw size={48} className="pending-icon" />
              <h2>Payment Pending Approval</h2>
              <p>Please wait while we verify your payment</p>
              <button className="close-btn" onClick={onClose}>
              </button>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="payment-status">
              <CheckCircle size={48} className="success-icon" />
              <h2>Payment Successful!</h2>
              <p>You can now access the study material</p>
              <button 
                className="access-btn"
                onClick={() => onSuccess(material.fileUrl)}
              >
                Access Notes
              </button>
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className="payment-status">
              <AlertCircle size={48} className="error-icon" />
              <h2>Payment Failed</h2>
              <p>Please try again</p>
              <button 
                className="retry-btn"
                onClick={() => setPaymentStatus(null)}
              >
                Retry Payment
              </button>
            </div>
          ) : (
            // Initial payment screen
            <>
              <h2>Complete Payment</h2>
              <div className="payment-details">
                <div className="material-info">
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                </div>
                <div className="price-tag">₹{material.price}</div>
              </div>

              <div className="payment-method">
                <h4>Pay using UPI</h4>
                <div className="upi-info">
                  <div className="upi-id">{UPI_ID}</div>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(UPI_ID)}>
                    Copy
                  </button>
                </div>
                <div className="user-upi-input">
                  <label>Your UPI ID</label>
                  <input 
                    type="text"
                    value={userUpi}
                    onChange={(e) => setUserUpi(e.target.value)}
                    placeholder="Enter your UPI ID"
                    required
                  />
                </div>
                <p className="instruction">
                  1. Open your UPI app
                  <br />
                  2. Send ₹{material.price} to the UPI ID above
                  <br />
                  3. Click "I have paid" after payment
                </p>
              </div>

              <button 
                className="payment-btn" 
                onClick={handlePayment}
                disabled={isPaying}
              >
                {isPaying ? 'Verifying...' : 'I have paid'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;