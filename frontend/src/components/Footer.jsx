import React from "react"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Stay Connected</h3>
          <div className="social-links">
            <a href="https://twitter.com/stubits" className="social-link">
              🐦 Twitter
            </a>
            <a href="https://instagram.com/stubits" className="social-link">
              📸 Instagram
            </a>
            <a href="https://linkedin.com/company/stubits" className="social-link">
              💼 LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="*">Privacy Policy</a>
          <a href="*">Terms of Service</a>
          <a href="*">Contact Us</a>
        </div>

        <div className="footer-section newsletter">
          <h3>Join the Community</h3>
          <p>Be part of something epic!</p>
          <div className="footer-cta">
            <button className="discord-btn">
              <span>Join Discord</span>
              <span className="emoji">🎮</span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Stubits. All rights reserved.</p>
        <p className="made-with">Made with 💜 for students</p>
      </div>
    </footer>
  )
}

export default Footer
