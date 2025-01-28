import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import "./Header.css"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <div className="logo-wrapper">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png"
            alt="Stubits Logo"
            className="logo"
          />
          <span className="logo-text">Stubits</span>
        </div>

        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/soon" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            Coming Soon
          </Link>
          <a href="#early-access" className="nav-link highlight" onClick={() => setIsMobileMenuOpen(false)}>
            Get Early Access
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header

