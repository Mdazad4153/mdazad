const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow specific frontend or all
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
