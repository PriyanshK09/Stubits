import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import Soon from "./components/Soon"
import About from "./components/About"
import Footer from "./components/Footer"
import Subscribers from "./components/Subscribers"
import StudyMaterials from "./components/StudyMaterials"
import AdminDashboard from "./components/AdminDashboard"
import AuthPage from "./components/AuthPage"
import AuthSuccess from './components/AuthSuccess';
import UserDashboard from "./components/UserDashboard"
import Donation from "./components/Donation"
import "./App.css"

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check admin status on load
    const checkAdminStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsAdmin(!!adminToken);
    };

    const handleBeforeUnload = () => {
      localStorage.removeItem('adminToken');
    };

    checkAdminStatus();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Header isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/admin" element={<AdminDashboard setIsAdmin={setIsAdmin} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/donate" element={<Donation />} />
          {/* All other pages redirected to Soon */}
          <Route path="*" element={<Soon />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

