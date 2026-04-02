const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect, restrictTo } = require('../middleware/auth');

// Add prescription (Doctor)
router.post('/doctor', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const rx = new Prescription({
      ...req.body,
      prescribedBy: req.user.id,
      prescribedByName: req.user.name,
      isSelfTracked: false
    });
    await rx.save();
    res.status(201).json(rx);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Add self-tracked (Patient)
router.post('/self', protect, restrictTo('patient'), async (req, res) => {
  try {
    const rx = new Prescription({
      ...req.body,
      patientId: req.user.id,
      prescribedByName: 'Self-tracked',
      isSelfTracked: true
    });
    await rx.save();
    res.status(201).json(rx);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get prescriptions for a single patient
router.get('/:patientId', protect, async (req, res) => {
  try {
    // If patient, restrict to their own ID
    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
