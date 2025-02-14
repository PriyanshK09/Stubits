require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();

// ✅ Allowed Origins for Frontend
const allowedOrigins = [
    "https://stubits.com",
    "http://localhost:3000"
];

// ✅ CORS Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // Handle pre-flight requests
    }

    next();
});

// ✅ Express Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'stubits_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// ✅ Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Ensure JWT_SECRET Exists
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'stubits_jwt_secret_key';
}

// ✅ Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const subscribeRoutes = require('./routes/subscribe');
const materialsRoutes = require('./routes/materials');
const paymentRoutes = require('./routes/payments');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', subscribeRoutes);
app.use('/api', materialsRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// ✅ Redirect Root to Main Website
app.get('/', (req, res) => {
    res.redirect(301, 'https://stubits.com');
});

// ✅ Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong! Please try again.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error('🚨 Unhandled Rejection:', err);
});

// ✅ Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});
