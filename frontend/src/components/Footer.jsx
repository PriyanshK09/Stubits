import React from "react"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Stay Connected</h3>
          <div className="social-links">
            <a href="https://x.com/StubitsOfficial" className="social-link">
              🐦 Twitter
            </a>
            <a href="http://instagram.com/stubitsofficial" className="social-link">
              📸 Instagram
            </a>
            <a href="https://discord.gg/TpfNFRWnhd" className="social-link">
              💼 Discord
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
            <button 
              className="discord-btn"
              onClick={() => window.open('https://discord.gg/TpfNFRWnhd', '_blank')}
            >
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
