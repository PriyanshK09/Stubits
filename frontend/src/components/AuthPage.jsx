import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, X } from "lucide-react"
import "./AuthPage.css"

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
    />
    <path
      fill="#34A853"
      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
    />
    <path
      fill="#4A90E2"
      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
    />
    <path
      fill="#FBBC05"
      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"
    />
  </svg>
);

const AuthPage = ({ onClose, onSuccess, isModal }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const url = `https://stubits.onrender.com/api/auth/${isLogin ? "login" : "register"}`
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("userToken", data.token)
        localStorage.setItem("userName", data.user.name)
        if (onSuccess) onSuccess()
      } else {
        setError(data.message || "Authentication failed")
      }
    } catch (error) {
      setError("Connection failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = 'https://stubits.onrender.com/api/auth/google';
  };

  const handleDiscordLogin = async () => {
    window.location.href = 'https://stubits.onrender.com/api/auth/discord';
  };

  const containerClass = `stubits-auth-wrapper ${isModal ? "modal" : ""}`

  return (
    <div className={containerClass}>
      {isModal && (
        <button className="close-modal" onClick={onClose}>
          <X />
        </button>
      )}

      <div className="stubits-auth-background">
        <div className="stubits-auth-grid"></div>
        <div className="stubits-auth-gradient"></div>
        <div className="stubits-floating-shapes">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`stubits-floating-shape shape-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <motion.div
        className="stubits-auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="stubits-auth-header">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            {isLogin ? "Welcome Back!" : "Join Stubits"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
          >
            {isLogin ? "Continue your learning journey" : "Start your learning journey today"}
          </motion.p>
        </div>

        <div className="stubits-auth-card">
          {error && <div className="stubits-error-message">{error}</div>}
          
          <div className="stubits-social-auth">
            <button 
              className="stubits-social-button google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button 
              className="stubits-social-button discord"
              onClick={handleDiscordLogin}
              disabled={isLoading}
            >
              <DiscordIcon />
              Continue with Discord
            </button>
          </div>

          <div className="stubits-auth-divider">
            <span>OR</span>
          </div>

          <div className="stubits-auth-tabs">
            <button 
              className={`stubits-tab ${isLogin ? "active" : ""}`} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`stubits-tab ${!isLogin ? "active" : ""}`} 
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <div 
              className="stubits-tab-indicator" 
              style={{ transform: `translateX(${isLogin ? "0%" : "100%"})` }} 
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="stubits-auth-form"
            >
              {!isLogin && (
                <div className="stubits-form-group">
                  <User className="stubits-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="stubits-form-group">
                <Mail className="stubits-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="stubits-form-group">
                <Lock className="stubits-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="stubits-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="stubits-forgot-password">
                  <a href="#reset-password">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit" 
                className="stubits-submit-button"
                disabled={isLoading}
              >
                <span>{isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="stubits-auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="stubits-toggle-auth" 
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                }}
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage