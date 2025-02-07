// frontend/src/components/PaymentGateway.jsx
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import './PaymentGateway.css';

const PaymentGateway = ({ material, onClose, onSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const UPI_ID = "payment@stubits"; // Example UPI ID

  const handlePayment = async () => {
    setIsPaying(true);
    // Simulate payment verification
    setTimeout(() => {
      setPaymentStatus('success');
      setIsPaying(false);
    }, 2000);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="payment-content">
          {!paymentStatus ? (
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
          ) : (
            <div className="payment-status">
              {paymentStatus === 'success' ? (
                <>
                  <CheckCircle size={48} className="success-icon" />
                  <h2>Payment Successful!</h2>
                  <p>You can now access the study material</p>
                  <button 
                    className="access-btn"
                    onClick={() => onSuccess(material.fileUrl)}
                  >
                    Access Notes
                  </button>
                </>
              ) : (
                <>
                  <AlertCircle size={48} className="error-icon" />
                  <h2>Payment Failed</h2>
                  <p>Please try again</p>
                  <button 
                    className="retry-btn"
                    onClick={() => setPaymentStatus(null)}
                  >
                    Retry Payment
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;