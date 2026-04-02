const express = require('express');
const router = express.Router();
const DoctorNote = require('../models/DoctorNote');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const { patientId, note } = req.body;
    const newNote = new DoctorNote({
      patientId,
      doctorId: req.user.id,
      note
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/:patientId', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const notes = await DoctorNote.find({ patientId: req.params.patientId, doctorId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
