require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const analysisRoutes = require('./routes/analysis');
const patientRoutes = require('./routes/patients');
const AnalysisController = require('./controllers/analysisController');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://pharmacogenomicriskpredictionsystem.netlify.app',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.get('/api/health', AnalysisController.healthCheck);
app.use('/api/analysis', analysisRoutes);
app.use('/api/patients', patientRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     PharmaGuard Server Started             ║
║     Port: ${PORT}                            ║
║     Environment: ${process.env.NODE_ENV || 'development'}        ║
║     Database: ${process.env.MONGODB_URI || 'local'}      ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;


