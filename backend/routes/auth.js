// backend/routes/auth.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const crypto = require('crypto');

// Add generateToken function
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Add logUserAuth function
const logUserAuth = (user, method) => {
  console.log('\n=== Authentication Log ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`User logged in - ${user.email}`);
  console.log(`Logged in through - ${method}`);
  console.log('User details:');
  console.log({
    id: user._id,
    name: user.name,
    email: user.email,
    authMethod: method,
    createdAt: user.createdAt
  });
  console.log('========================\n');
};

// Google OAuth config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(16).toString('hex'),
          googleId: profile.id
        });
      }
      
      logUserAuth(user, 'google');
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Discord OAuth config
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/discord/callback",
    scope: ['identify', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ 
        $or: [
          { discordId: profile.id },
          { email: profile.email }
        ]
      });
      
      if (!user) {
        user = await User.create({
          name: profile.username,
          email: profile.email,
          password: crypto.randomBytes(16).toString('hex'),
          discordId: profile.id
        });
      } else {
        // Update existing user with Discord ID if not present
        if (!user.discordId) {
          user.discordId = profile.id;
          await user.save();
        }
      }
      
      logUserAuth(user, 'discord');
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    logUserAuth(user, 'website');
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/auth?error=true',
    session: false
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      res.redirect(`http://localhost:3000/auth-success?token=${token}&name=${encodeURIComponent(req.user.name)}`);
    } catch (error) {
      res.redirect('http://localhost:3000/auth?error=true');
    }
  }
);

router.get('/discord',
  passport.authenticate('discord', { 
    scope: ['identify', 'email'],
    prompt: 'consent'
  })
);

router.get('/discord/callback',
  passport.authenticate('discord', { 
    failureRedirect: 'http://localhost:3000/auth?error=true',
    session: false 
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const redirectUrl = `http://localhost:3000/auth-success?token=${token}&name=${encodeURIComponent(req.user.name)}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Discord callback error:', error);
      res.redirect('http://localhost:3000/auth?error=true');
    }
  }
);

// Export router
module.exports = router;