require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', require('./routes/subscribe'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/materials', require('./routes/materials')); // Updated path

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

// Redirect root to main website
app.get('/', (req, res) => {
  res.redirect(301, 'https://stubits.com');
});

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong! Please try again.' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});