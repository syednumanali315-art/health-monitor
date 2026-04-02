const express = require('express');
const router = express.Router();
const Vital = require('../models/Vital');
const User = require('../models/User');
const Alert = require('../models/Alert');
const { protect, restrictTo } = require('../middleware/auth');
const { evaluateVitals } = require('../services/vitalsService');
const { sendEmergencyAlert } = require('../services/snsService');

// Submit vitals (Patient)
router.post('/', protect, restrictTo('patient'), async (req, res) => {
  try {
    const analysis = evaluateVitals(req.body);
    
    const vital = new Vital({
      ...req.body,
      patientId: req.user.id,
      overallStatus: analysis.overallStatus,
      conditionNow: analysis.conditionNow,
      risks: analysis.risks,
      nextAction: analysis.nextAction,
      isEmergency: analysis.isEmergency
    });

    await vital.save();

    if (analysis.isEmergency) {
      // Create alerts and trigger SNS
      const patient = await User.findById(req.user.id);
      let doctorMobile = null;
      if(patient.assignedDoctor) {
        const doc = await User.findById(patient.assignedDoctor);
        if(doc) doctorMobile = doc.mobile;
      }

      for (let reason of analysis.emgs) {
        await new Alert({
          patientId: req.user.id,
          triggerReason: reason,
          message: `Emergency Alert: Critical Vitals Detected -> ${reason}`
        }).save();
      }

      await sendEmergencyAlert(
        analysis.emgs.join(', '), 
        patient.name, 
        patient.emergencyContact || patient.mobile,
        doctorMobile
      );
    }

    res.status(201).json(vital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Patient gets their own vitals
router.get('/my-vitals', protect, restrictTo('patient'), async (req, res) => {
  try {
    const vitals = await Vital.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Doctor gets patient vitals
router.get('/patient/:patientId', protect, restrictTo('doctor'), async (req, res) => {
  try {
    const vitals = await Vital.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
