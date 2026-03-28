const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Register
router.post('/register', async (req, res) => {
  const { role, password, ...rest } = req.body;
  
  if (!role || !password) {
    return res.status(400).json({ msg: 'Please provide role and password' });
  }

  try {
    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email: rest.email });
      if (user) return res.status(400).json({ msg: 'Doctor already exists' });
      user = new Doctor({ ...rest, password });
    } else {
      user = await Patient.findOne({ email: rest.email });
      if (user) return res.status(400).json({ msg: 'Patient already exists' });
      user = new Patient({ ...rest, password });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role, user: { id: user.id, name: user.name, email: user.email }});
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ msg: 'Please provide email, password, and role' });
  }

  try {
    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else {
      user = await Patient.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role, user: { id: user.id, name: user.name, email: user.email }});
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get User Info (Protected)
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    let user;
    if(req.user.role === 'doctor') {
      user = await Doctor.findById(req.user.id).select('-password');
    } else {
      user = await Patient.findById(req.user.id).select('-password');
    }
    if(!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
