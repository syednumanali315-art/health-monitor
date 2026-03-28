const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');

// Add health data
router.post('/', async (req, res) => {
  try {
    const { bloodPressure, sugarLevel, heartRate, oxygenLevel, temperature } = req.body;
    let isEmergency = false;
    let prescription = "";

    // Emergency checks and prescriptions
    if (bloodPressure && bloodPressure.systolic > 140) {
      isEmergency = true;
      prescription += "High BP: Take Amlodipine 5mg. ";
    }
    if (sugarLevel > 200) {
      isEmergency = true;
      prescription += "High Sugar: Take Insulin. ";
    }
    if (oxygenLevel < 90) {
      isEmergency = true;
      prescription += "Low Oxygen: Seek immediate medical attention. ";
    }
    if (heartRate > 120) {
      isEmergency = true;
      prescription += "High Heart Rate: Take Metoprolol. ";
    }

    const healthData = new HealthData({
      ...req.body,
      isEmergency,
      prescription
    });
    
    await healthData.save();
    res.status(201).json(healthData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get health data for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const data = await HealthData.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all recent emergency health data
router.get('/emergencies', async (req, res) => {
  try {
    const emergencies = await HealthData.find({ isEmergency: true })
      .populate('patient')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
