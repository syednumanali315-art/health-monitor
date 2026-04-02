require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const vitalsRouter = require('./routes/vitals');
const prescriptionsRouter = require('./routes/prescriptions');
const reportsRouter = require('./routes/reports');
const doctorNotesRouter = require('./routes/doctorNotes');
const { protect, restrictTo } = require('./middleware/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: [allowedOrigins, '*'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Doctor's patients lookup route
app.get('/api/patients', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// App Routes
app.use('/api/auth', authRouter);
app.use('/api/vitals', vitalsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/doctor-notes', doctorNotesRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cloud-health-monitor';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
