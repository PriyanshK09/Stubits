import React, { useEffect, useState } from "react"
import { Book, Brain, Clock, Users } from "lucide-react"
import "./About.css"

const About = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="about-container">
      <div className="background-effects">
        <div className="gradient-bg"></div>
        <div className="grid-overlay"></div>
      </div>

      <main className={`content ${isVisible ? "visible" : ""}`}>
        <h1 className="about-title">
          About <span className="gradient-text">Stubits</span>
        </h1>

        <section className="about-section">
          <p className="about-text">
            We're here to make your learning journey easier, smarter, and more effective! We provide free notes to
            master concepts, memory technique-based mock papers to practice perfection, mentors to guide you at every
            step, test series to help you ace exams, and many more.
          </p>
          <p className="about-text">
            Your success is our mission. And to make sure that we use techniques like color coding, active recall, and
            timed quizzes with various topics and custom questions.
          </p>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <Book className="feature-icon" />
            <h3>Free Study Notes</h3>
            <p>Comprehensive notes to master key concepts</p>
          </div>
          <div className="feature-card">
            <Brain className="feature-icon" />
            <h3>Memory Techniques</h3>
            <p>Innovative methods to enhance retention</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Expert Mentors</h3>
            <p>Guidance at every step of your journey</p>
          </div>
          <div className="feature-card">
            <Clock className="feature-icon" />
            <h3>Timed Quizzes</h3>
            <p>Practice with custom questions and topics</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default About

