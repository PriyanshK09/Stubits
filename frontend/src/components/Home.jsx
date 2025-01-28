"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Book,
  Lightbulb,
  Rocket,
  Brain,
  PenTool,
  Notebook,
  GraduationCap,
  Calculator,
  Clock,
  Coffee,
  Bookmark,
  FileText,
} from "lucide-react"
import "./Home.css"

const Home = () => {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEmail("")
    alert("Thanks for your interest! We'll keep you posted.")
  }

  const floatingIcons = [
    { Icon: Book, delay: 0, position: { top: "15%", left: "10%" } },
    { Icon: Lightbulb, delay: 2, position: { top: "25%", right: "15%" } },
    { Icon: Rocket, delay: 4, position: { bottom: "20%", left: "20%" } },
    { Icon: Brain, delay: 6, position: { top: "40%", right: "25%" } },
    { Icon: PenTool, delay: 8, position: { bottom: "30%", right: "10%" } },
    { Icon: Notebook, delay: 10, position: { top: "60%", left: "15%" } },
    { Icon: GraduationCap, delay: 12, position: { bottom: "40%", right: "30%" } },
    { Icon: Calculator, delay: 14, position: { top: "30%", left: "25%" } },
    { Icon: Clock, delay: 16, position: { bottom: "25%", left: "30%" } },
    { Icon: Coffee, delay: 18, position: { top: "70%", right: "20%" } },
    { Icon: Bookmark, delay: 20, position: { top: "20%", left: "40%" } },
    { Icon: FileText, delay: 22, position: { bottom: "15%", right: "40%" } },
  ]

  return (
    <div ref={containerRef} className="home-container" onMouseMove={handleMouseMove}>
      <div
        className="glow-effect"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      <div className="background-effects">
        <div className="gradient-bg"></div>
        <div className="grid-overlay"></div>
        <div className="floating-icons">
          {floatingIcons.map(({ Icon, delay, position }, index) => (
            <div
              key={index}
              className="floating-icon"
              style={{
                ...position,
                animationDelay: `${delay}s`,
              }}
            >
              <Icon size={24} />
            </div>
          ))}
        </div>
      </div>

      <main className={`content ${isVisible ? "visible" : ""}`}>
        <section className="hero-section">
          <h1 className="hero-title">
            <span className="gradient-text">Level Up</span> Your
            <br />
            Study Game
          </h1>
          <p className="hero-subtitle">The future of collaborative learning is coming to your screens.</p>

          <form onSubmit={handleSubmit} className="email-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
                required
                className="email-input"
              />
              <button type="submit" className="submit-button">
                Get Early Access
                <span className="button-glow"></span>
              </button>
            </div>
            <div className="social-proof">
              <div className="avatars">
                <div className="avatar" style={{ background: "linear-gradient(45deg, #9333ea, #7928ca)" }}>
                  👩‍🎓
                </div>
                <div className="avatar" style={{ background: "linear-gradient(45deg, #9333ea, #7928ca)" }}>
                  👨‍🎓
                </div>
                <div className="avatar" style={{ background: "linear-gradient(45deg, #9333ea, #7928ca)" }}>
                  🎓
                </div>
              </div>
              <p className="social-proof-text">Join 1000+ students waiting in line</p>
            </div>
          </form>
        </section>

        <div className="decorative-elements">
          <div className="floating-cube cube-1">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png"
              alt=""
              className="cube-image"
            />
          </div>
          <div className="floating-cube cube-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png"
              alt=""
              className="cube-image"
            />
          </div>
          <div className="floating-cube cube-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png"
              alt=""
              className="cube-image"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

