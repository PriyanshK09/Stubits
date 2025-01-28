"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Rocket,
  Clock,
  Bell,
  Zap,
  Brain,
  Book,
  Lightbulb,
  Star,
  Sparkles,
  GraduationCap,
  Code,
  LineChart,
  Atom,
  Coffee,
} from "lucide-react"
import "./Soon.css"

const Soon = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
    const target = new Date("2025-08-15T00:00:00")

    const calculateTime = () => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)
      
      setIsLoading(false)
    }

    calculateTime()

    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
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
    console.log("Email submitted:", email)
    setEmail("")
  }

  const floatingIcons = [
    { Icon: Brain, delay: 0, position: { top: "15%", left: "10%" } },
    { Icon: Book, delay: 2, position: { top: "25%", right: "15%" } },
    { Icon: Lightbulb, delay: 4, position: { bottom: "20%", left: "20%" } },
    { Icon: Star, delay: 6, position: { top: "40%", right: "25%" } },
    { Icon: Sparkles, delay: 8, position: { bottom: "30%", right: "10%" } },
    { Icon: GraduationCap, delay: 10, position: { top: "60%", left: "15%" } },
    { Icon: Code, delay: 12, position: { bottom: "40%", right: "30%" } },
    { Icon: LineChart, delay: 14, position: { top: "30%", left: "25%" } },
    { Icon: Atom, delay: 16, position: { bottom: "25%", left: "30%" } },
    { Icon: Coffee, delay: 18, position: { top: "70%", right: "20%" } },
  ]

  return (
    <div ref={containerRef} className="soon-container" onMouseMove={handleMouseMove}>
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
        <div className="soon-header">
          <Rocket className="title-icon" />
          <h1 className="soon-title">
            Coming <span className="gradient-text">Soon</span>
          </h1>
        </div>

        <p className="soon-subtitle">Get ready to revolutionize your study experience with Stubits!</p>

        <div className={`countdown-container ${isLoading ? 'loading' : ''}`}>
          {[
            { value: days, label: "Days" },
            { value: hours, label: "Hours" },
            { value: minutes, label: "Minutes" },
            { value: seconds, label: "Seconds" },
          ].map((item, index) => (
            <div key={index} className="countdown-item">
              <span className="countdown-value">{item.value}</span>
              <span className="countdown-label">{item.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="notify-form">
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
              Notify Me
              <Bell className="button-icon" />
            </button>
          </div>
        </form>

        <div className="features-preview">
          {[
            { icon: Clock, text: "Smart Scheduling" },
            { icon: Zap, text: "AI-Powered Learning" },
            { icon: Rocket, text: "Accelerated Progress" },
          ].map((feature, index) => (
            <div key={index} className="feature-item">
              <feature.icon className="feature-icon" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Soon
