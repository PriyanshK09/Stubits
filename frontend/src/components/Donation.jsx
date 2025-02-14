import React, { useState } from "react"
import { 
  Heart, Coffee, Book, Lightbulb, DollarSign, 
  Star, GraduationCap 
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
    icon: Lightbulb, 
    label: "Fuel innovation",
    description: "Support the development of new learning features"
  },
  { 
    amount: 5000, 
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
  const [message, setMessage] = useState("")

  const handleDonation = async (e) => {
    e.preventDefault()
    // Add your donation processing logic here
  }

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
              onClick={() => setSelectedAmount(option.amount)}
            >
              <option.icon className="option-icon" />
              <div className="option-content">
                <h3>{option.label}</h3>
                <p>{option.description}</p>
                <span className="amount">₹{option.amount}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="custom-donation">
          <div className="custom-amount">
            <DollarSign className="currency-icon" />
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value)
                setSelectedAmount(null)
              }}
            />
          </div>
        </div>

        <form onSubmit={handleDonation} className="donation-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Leave a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="donate-btn">
            <Heart className="btn-icon" />
            Make Donation
          </button>
        </form>
      </div>
    </div>
  )
}

export default Donation