import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Check, X } from 'lucide-react';
import './PaymentManagement.css';

const PaymentManagement = ({ adminPassword }) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Remove unused processingPayments state
  const [processingPaymentAction, setProcessingPaymentAction] = useState({ id: null, action: null });

  const fetchPayments = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://stubits.onrender.com/api/admin/payments', {
        headers: {
          adminKey: adminPassword
        }
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [adminPassword]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      setProcessingPaymentAction({ id: paymentId, action: status });
      
      const response = await fetch(`https://stubits.onrender.com/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          adminKey: adminPassword
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update payment status');
      await fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setProcessingPaymentAction({ id: null, action: null });
    }
  };

  const renderPaymentCard = (payment) => {
    // Add null checks for payment and its properties
    if (!payment || !payment.materialId || !payment.userId) {
      return null;
    }

    const isProcessingApprove = processingPaymentAction.id === payment._id && processingPaymentAction.action === 'approved';
    const isProcessingReject = processingPaymentAction.id === payment._id && processingPaymentAction.action === 'rejected';
    const isAnyProcessing = isProcessingApprove || isProcessingReject;

    return (
      <div key={payment._id} className="payment-card">
        <div className="payment-info">
          <div className="payment-header">
            <div className="payment-title">
              <h3>{payment.materialId.title}</h3>
              <span className={`status ${payment.status}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
            <div className="payment-amount">
              <span>₹{payment.amount}</span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Student Name</label>
              <span>{payment.userId.name}</span>
            </div>
            <div className="info-item">
              <label>Student Email</label>
              <span>{payment.userId.email}</span>
            </div>
            <div className="info-item">
              <label>UPI ID</label>
              <span>{payment.userUpi}</span>
            </div>
            <div className="info-item">
              <label>Date</label>
              <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {payment.status === 'pending' && (
            <div className="payment-actions">
              <button
                className={`approve-btn ${isProcessingApprove ? 'processing' : ''}`}
                onClick={() => updatePaymentStatus(payment._id, 'approved')}
                disabled={isAnyProcessing}
              >
                {isProcessingApprove ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Approve Payment
                  </>
                )}
              </button>
              <button
                className={`reject-btn ${isProcessingReject ? 'processing' : ''}`}
                onClick={() => updatePaymentStatus(payment._id, 'rejected')}
                disabled={isAnyProcessing}
              >
                {isProcessingReject ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X size={18} />
                    Reject Payment
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="payments-loading">
        <RefreshCw className="spin-icon" size={24} />
        <span>Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>Payment Management</h2>
        <button 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={fetchPayments}
          disabled={refreshing}
        >
          <RefreshCw size={20} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="payments-list">
        {payments.length === 0 ? (
          <div className="no-payments">No payments found</div>
        ) : (
          payments.map(payment => renderPaymentCard(payment))
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;