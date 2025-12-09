const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
// Middleware
// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:5500',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'https://mdazad.netlify.app',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove empty values

    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Fallback: If no FRONTEND_URL is enforced yet, allow the origin (Reflect)
    // This allows the Netlify app to work immediately without setting env vars first
    if (!process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend only if it exists (Optional for monorepo)
// app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
    message: 'Portfolio API is running!'
  })
})

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  // In production, we might want to exit. In dev, we can warn.
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/portfolio') // Fallback for local dev only
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const skillRoutes = require('./routes/skills');
const educationRoutes = require('./routes/education');
const projectRoutes = require('./routes/projects');
const certificateRoutes = require('./routes/certificates');
const serviceRoutes = require('./routes/services');
const blogRoutes = require('./routes/blog');
const testimonialRoutes = require('./routes/testimonials');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
