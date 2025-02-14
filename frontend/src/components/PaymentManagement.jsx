"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, X, RefreshCw, FileText, User, Mail, CreditCard } from "lucide-react"
import "./PaymentManagement.css"

const PaymentManagement = ({ adminPassword }) => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [processingPayments, setProcessingPayments] = useState(new Set()) // Track payments being processed

  const fetchPayments = useCallback(async () => {
    try {
      setRefreshing(true)
      const response = await fetch("https://stubits.onrender.com/api/admin/payments", {
        headers: { adminKey: adminPassword },
      })
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [adminPassword])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleRefresh = () => {
    fetchPayments()
  }

  const updatePaymentStatus = async (paymentId, status) => {
    try {
      setProcessingPayments(prev => new Set(prev).add(paymentId)) // Add payment to processing set
      
      await fetch(`https://stubits.onrender.com/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          adminKey: adminPassword,
        },
        body: JSON.stringify({ status }),
      })
      await fetchPayments()
    } catch (error) {
      console.error("Failed to update payment:", error)
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev)
        newSet.delete(paymentId)
        return newSet
      })
    }
  }

  // Update the payment actions JSX to show loading state
  const renderPaymentActions = (payment) => {
    const isProcessing = processingPayments.has(payment._id)

    return payment.status === "pending" && (
      <div className="payment-actions">
        <button 
          className={`approve-btn ${isProcessing ? 'processing' : ''}`}
          onClick={() => updatePaymentStatus(payment._id, "approved")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <RefreshCw size={18} className="spin-icon" />
          ) : (
            <Check size={18} />
          )}
          {isProcessing ? 'Processing...' : 'Approve Payment'}
        </button>
        <button 
          className={`reject-btn ${isProcessing ? 'processing' : ''}`}
          onClick={() => updatePaymentStatus(payment._id, "rejected")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <RefreshCw size={18} className="spin-icon" />
          ) : (
            <X size={18} />
          )}
          {isProcessing ? 'Processing...' : 'Reject Payment'}
        </button>
      </div>
    )
  }

  return (
    <div className="admin-component-content">
      <div className="admin-component-header">
        <div className="header-text">
          <h2>Payment Management</h2>
          <p>Review and manage payment requests from users</p>
        </div>
        <div className="header-actions">
          <button 
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="payments-container">
        <div className="payments-list">
          {payments.map((payment) => (
            <div key={payment._id} className={`payment-card ${payment.status}`}>
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
                    <label>Buyer</label>
                    <span>
                      <User size={16} style={{ display: "inline", marginRight: "8px" }} />
                      {payment.userId.name}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>
                      <Mail size={16} style={{ display: "inline", marginRight: "8px" }} />
                      {payment.userId.email}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>UPI ID</label>
                    <span>
                      <CreditCard size={16} style={{ display: "inline", marginRight: "8px" }} />
                      {payment.userUpi}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Material</label>
                    <span>
                      <FileText size={16} style={{ display: "inline", marginRight: "8px" }} />
                      {payment.materialId.title}
                    </span>
                  </div>
                </div>
                {renderPaymentActions(payment)}
              </div>
            </div>
          ))}
          {payments.length === 0 && <div className="no-payments">No payments found</div>}
        </div>
      </div>
    </div>
  )
}

export default PaymentManagement