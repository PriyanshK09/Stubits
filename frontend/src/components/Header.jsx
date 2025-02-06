import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Header.css";

const Header = ({ isAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminTag, setShowAdminTag] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkAdminStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      setShowAdminTag(!!adminToken);
    };

    window.addEventListener("scroll", handleScroll);
    checkAdminStatus(); // Check on mount
    
    // Setup interval to check admin status
    const interval = setInterval(checkAdminStatus, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <Link to="/" className="logo-wrapper">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png"
            alt="Stubits Logo"
            className="logo"
          />
          <div className="logo-group">
            <span className="logo-text">Stubits</span>
            {showAdminTag && <span className="admin-tag">Admin</span>}
          </div>
        </Link>

        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/study-materials" className="nav-link">
            Study Materials
          </Link>
          <Link to="/soon" className="nav-link">
            Coming Soon
          </Link>
          {showAdminTag && (
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
          )}
          <a href="#early-access" className="nav-link highlight">
            Get Early Access
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
