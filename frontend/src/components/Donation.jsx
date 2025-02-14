import React, { useState } from "react"
import { 
  Heart, Coffee, Book,  
  Star, GraduationCap, IndianRupee,
  QrCode
} from "lucide-react"
import "./Donation.css"

const donationOptions = [
  { 
    amount: 100, 
    icon: Coffee, 
    label: "Buy us a coffee",
    description: "Help fuel our late-night coding sessions"
  },
  { 
    amount: 500, 
    icon: Book, 
    label: "Support a student",
    description: "Help a student access premium study materials"
  },
  { 
    amount: 1000, 
    icon: Heart, 
    label: "Become a hero",
    description: "Make a significant impact on student education"
  }
]

const UPI_ID = "payment@stubits"; // Replace with your actual UPI ID

const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [upiId, setUpiId] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    upi: false
  });
  const [showErrors, setShowErrors] = useState(false);

  const handleDonation = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    const finalAmount = selectedAmount || Number(customAmount);

    if (!finalAmount || !upiId || !name || !email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch('https://stubits.onrender.com/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          amount: finalAmount,
          upiId,
          message: message || undefined
        })
      });

      if (response.ok) {
        // Remove data variable since it's not being used
        await response.json(); // Keep the await to ensure request completes
        
        // Clear form after successful submission
        setName("");
        setEmail("");
        setUpiId("");
        setMessage("");
        setSelectedAmount(null);
        setCustomAmount("");
        setTouched({
          name: false,
          email: false,
          upi: false
        });
        setShowErrors(false);

        // Show success message
        alert("Thank you for your donation! Our team will process it shortly.");
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process donation');
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert("Failed to process donation. Please try again later.");
    }
  };

  return (
    <div className="donation-container">
      <div className="background-effects">
        <div className="gradient-bg"></div>
        <div className="grid-overlay"></div>
        <div className="floating-icons">
          {[Heart, Star, GraduationCap].map((Icon, index) => (
            <div
              key={index}
              className="floating-icon"
              style={{
                animationDelay: `${index * 4}s`,
                top: `${20 + index * 25}%`,
                left: `${10 + index * 30}%`
              }}
            >
              <Icon size={24} />
            </div>
          ))}
        </div>
      </div>

      <div className="donation-content">
        <div className="donation-header">
          <h1>Support Our Mission</h1>
          <p>Help us empower students with better educational resources</p>
        </div>

        <div className="donation-options">
          {donationOptions.map((option) => (
            <button
              key={option.amount}
              className={`donation-option ${selectedAmount === option.amount ? 'active' : ''}`}
              onClick={() => {
                setSelectedAmount(option.amount)
                setCustomAmount("")
              }}
            >
              <option.icon className="option-icon" />
              <div className="option-content">
                <h3>{option.label}</h3>
                <p>{option.description}</p>
                <span className="amount">
                  <IndianRupee className="rupee-icon" size={18} />
                  {option.amount}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="custom-donation">
          <div className="custom-amount">
            <IndianRupee className="currency-icon" />
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value)
                setSelectedAmount(null)
              }}
              min="1"
            />
          </div>
        </div>

        <div className="donation-qr-section">
          <div className="qr-container">
            <div className="qr-header">
              <QrCode size={24} />
              <h3>Scan & Pay</h3>
            </div>
            <div className="qr-code">
              <img 
                src="/images/upiqr.jpg"
                alt="UPI QR Code"
                width="200"
                height="200"
              />
            </div>
            <div className="upi-details">
              <div className="upi-id-display">
                <span className="label">UPI ID:</span>
                <span className="value">{UPI_ID}</span>
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(UPI_ID);
                    alert('UPI ID copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleDonation} className="donation-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                className={`${touched.name || showErrors ? 'show-error' : ''}`}
                required
              />
              <span className="error-message">Please enter your name</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                className={`${touched.email || showErrors ? 'show-error' : ''}`}
                required
              />
              <span className="error-message">Please enter a valid email address</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="upi">UPI ID</label>
            <input
              id="upi"
              type="text"
              placeholder="Enter your UPI ID (e.g., name@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, upi: true }))}
              className={`${touched.upi || showErrors ? 'show-error' : ''}`}
              required
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z]+"
              title="Please enter a valid UPI ID (e.g., name@upi)"
            />
            <span className="error-message">Please enter a valid UPI ID</span>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              placeholder="Leave a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
            />
          </div>
          <button 
            type="submit" 
            className="donate-btn"
            disabled={!((selectedAmount || customAmount) && upiId)}
          >
            <Heart className="btn-icon" />
            Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  )
}

export default Donation