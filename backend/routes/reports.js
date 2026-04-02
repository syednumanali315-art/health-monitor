const express = require('express');
const router = express.Router();
const multer = require('multer');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/', protect, upload.single('reportFile'), async (req, res) => {
  try {
    const newReport = new Report({
      patientId: req.user.role === 'patient' ? req.user.id : req.body.patientId,
      category: req.body.category,
      name: req.body.name,
      filePath: req.file.path,
      uploadedBy: req.user.name
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/:patientId', protect, async (req, res) => {
  try {
    if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const reports = await Report.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
