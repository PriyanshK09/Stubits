import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Book } from "lucide-react";
import "./Header.css";

const Header = ({ isAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminTag, setShowAdminTag] = useState(false);
  const [userName, setUserName] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      const name = localStorage.getItem('userName');
      setShowAdminTag(!!adminToken);
      setUserName(name);
    };

    window.addEventListener("scroll", handleScroll);
    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    setUserName(null);
  };

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setShowUserMenu(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

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
          {userName ? (
            <div className="user-menu" onClick={handleUserMenuClick}>
              <button className="user-menu-button">
                <User size={18} />
                <span>{userName}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item">
                    <Book size={16} />
                    My Dashboard
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="nav-link highlight">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
