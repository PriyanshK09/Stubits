import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import Soon from "./components/Soon"
import About from "./components/About"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* All other pages redirected to Soon */}
          <Route path="*" element={<Soon />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

