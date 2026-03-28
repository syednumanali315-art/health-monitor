require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const patientsRouter = require('./routes/patients');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/patients', patientsRouter);
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cloud-health-monitor';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
