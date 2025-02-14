import React, { useState } from "react"
import { 
  Heart, Coffee, Book,  
  Star, GraduationCap, IndianRupee 
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

const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [upiId, setUpiId] = useState("")
  const [message, setMessage] = useState("")
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
    if (!finalAmount || !upiId) {
      alert("Please select an amount and enter UPI ID");
      return;
    }
    // Add your UPI payment logic here
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
              pattern="[a-zA-Z0-9\.\-\_]+@[a-zA-Z][a-zA-Z]+"
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