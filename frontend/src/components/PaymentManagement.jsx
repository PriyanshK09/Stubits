import React, { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import './PaymentManagement.css';

const PaymentManagement = ({ adminPassword }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/payments', {
        headers: { 'adminKey': adminPassword }
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  }, [adminPassword]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'adminKey': adminPassword
        },
        body: JSON.stringify({ status })
      });
      fetchPayments();
    } catch (error) {
      console.error('Failed to update payment:', error);
    }
  };

  if (loading) {
    return <div className="payments-loading">Loading payments...</div>;
  }

  return (
    <div className="payments-container">
      <h2>Payment Management</h2>
      <div className="payments-list">
        {payments.map(payment => (
          <div key={payment._id} className={`payment-card ${payment.status}`}>
            <div className="payment-info">
              <h3>{payment.materialId.title}</h3>
              <p>Buyer: {payment.userId.name}</p>
              <p>Email: {payment.userId.email}</p>
              <p>Amount: ₹{payment.amount}</p>
              <p className={`status ${payment.status}`}>
                Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </p>
            </div>
            {payment.status === 'pending' && (
              <div className="payment-actions">
                <button
                  className="approve-btn"
                  onClick={() => updatePaymentStatus(payment._id, 'approved')}
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updatePaymentStatus(payment._id, 'rejected')}
                >
                  <X size={18} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {payments.length === 0 && (
          <div className="no-payments">No payments found</div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;