const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const auth = require('../middleware/auth');

// ─── Heart Rate Classification ─────────────────────────────────────────────
function classifyHeartRate(heartRate, patientType, childAgeGroup) {
  if (!heartRate) return 'Normal';
  if (patientType === 'child') {
    const ranges = {
      newborn: { low: 70, high: 190 },
      infant:  { low: 80, high: 160 },
      toddler: { low: 80, high: 130 },
      child:   { low: 70, high: 120 },
      teen:    { low: 60, high: 100 },
    };
    const range = ranges[childAgeGroup] || ranges['child'];
    if (heartRate < range.low) return 'Low';
    if (heartRate > range.high) return 'High';
    return 'Normal';
  }
  // Adult
  if (heartRate < 60) return 'Low';
  if (heartRate > 100) return 'High';
  return 'Normal';
}

// ─── Condition & Risk Engine ───────────────────────────────────────────────
function analyzeCondition(data) {
  const { bloodPressure, sugarLevel, heartRate, oxygenLevel, temperature, heartRateStatus, symptoms } = data;
  const conditions = [];
  let riskLevel = 'Low';
  const actions = [];
  let isEmergency = false;
  let prescription = '';

  // Blood Pressure
  if (bloodPressure) {
    const sys = bloodPressure.systolic;
    const dia = bloodPressure.diastolic;
    if (sys > 180 || dia > 120) {
      conditions.push('Possible hypertensive crisis (Very High BP)');
      riskLevel = 'Critical'; isEmergency = true;
      actions.push('Go to emergency room immediately');
      prescription += 'High BP (Critical): Seek emergency care. ';
    } else if (sys > 140) {
      conditions.push('Possible hypertension risk (High BP)');
      if (riskLevel !== 'Critical') riskLevel = 'High';
      actions.push('Consult doctor for BP management');
      prescription += 'High BP: Suggested medicine type – Amlodipine (prescription required). ';
    } else if (sys < 90) {
      conditions.push('Possible hypotension risk (Low BP)');
      if (riskLevel === 'Low') riskLevel = 'Moderate';
      actions.push('Increase fluid intake; consult doctor');
    }
  }

  // Sugar
  if (sugarLevel) {
    if (sugarLevel > 300) {
      conditions.push('Possible hyperglycemia risk (Very High Sugar)');
      riskLevel = 'Critical'; isEmergency = true;
      actions.push('Seek emergency medical attention');
      prescription += 'Very High Sugar: Insulin may be needed – doctor review required. ';
    } else if (sugarLevel > 200) {
      conditions.push('Possible hyperglycemia risk (High Sugar)');
      if (riskLevel !== 'Critical') riskLevel = 'High';
      actions.push('Consult doctor for sugar management');
      prescription += 'High Sugar: Suggested medicine type – Insulin/Metformin (prescription required). ';
    } else if (sugarLevel < 70) {
      conditions.push('Possible hypoglycemia risk (Low Sugar)');
      if (riskLevel !== 'Critical') riskLevel = 'High';
      isEmergency = true;
      actions.push('Take glucose immediately; consult doctor');
      prescription += 'Low Sugar: Take sugar/glucose immediately. ';
    }
  }

  // Oxygen
  if (oxygenLevel) {
    if (oxygenLevel < 85) {
      conditions.push('Possible severe respiratory distress (Very Low Oxygen)');
      riskLevel = 'Critical'; isEmergency = true;
      actions.push('Call emergency services immediately');
      prescription += 'Very Low Oxygen: Emergency oxygen therapy needed immediately. ';
    } else if (oxygenLevel < 90) {
      conditions.push('Possible respiratory distress risk (Low Oxygen)');
      if (riskLevel !== 'Critical') riskLevel = 'High';
      isEmergency = true;
      actions.push('Seek immediate medical attention');
      prescription += 'Low Oxygen: Seek immediate medical attention. ';
    }
  }

  // Heart Rate
  if (heartRateStatus === 'High') {
    conditions.push('Possible tachycardia risk (High Heart Rate)');
    if (riskLevel === 'Low') riskLevel = 'Moderate';
    if (heartRate > 150) { riskLevel = 'High'; isEmergency = true; }
    actions.push('Rest; consult doctor if persists');
    prescription += 'High Heart Rate: Suggested medicine type – Metoprolol (prescription required). ';
  } else if (heartRateStatus === 'Low') {
    conditions.push('Possible bradycardia risk (Low Heart Rate)');
    if (riskLevel === 'Low') riskLevel = 'Moderate';
    actions.push('Consult doctor for heart rate evaluation');
  }

  // Temperature
  if (temperature) {
    if (temperature > 104) {
      conditions.push('Possible high fever / serious infection risk');
      if (riskLevel !== 'Critical') riskLevel = 'High';
      isEmergency = true;
      actions.push('Seek emergency care for very high fever');
      prescription += 'Very High Fever: Paracetamol/Ibuprofen (doctor review required). ';
    } else if (temperature > 100.4) {
      conditions.push('Possible fever / infection risk');
      if (riskLevel === 'Low') riskLevel = 'Moderate';
      actions.push('Rest, hydrate; consult doctor if fever persists');
      prescription += 'Fever: Paracetamol may help – consult doctor. ';
    }
  }

  if (conditions.length === 0) {
    conditions.push('Vitals appear within acceptable range');
    actions.push('Continue regular monitoring');
  }

  return {
    possibleCondition: conditions.join(' | '),
    riskLevel,
    recommendedAction: actions.join('; '),
    isEmergency,
    prescription: prescription || 'No immediate medication indicated – maintain regular checkups.',
    emergencyStatus: isEmergency ? 'EMERGENCY – Immediate attention required' : 'Stable'
  };
}

// ─── AWS SNS Alert ─────────────────────────────────────────────────────────
async function sendSNSAlert(patientName, condition, riskLevel) {
  if (!process.env.AWS_SNS_TOPIC_ARN || !process.env.AWS_REGION) {
    console.log('[SNS] SNS not configured – skipping alert');
    return false;
  }
  try {
    const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
    const client = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    const message = `
🚨 EMERGENCY HEALTH ALERT 🚨
Patient: ${patientName || 'Unknown'}
Risk Level: ${riskLevel}
Possible Condition: ${condition}
Action Required: Immediate medical attention needed.
— Cloud Health Monitor System
    `.trim();
    await client.send(new PublishCommand({
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Message: message,
      Subject: `[EMERGENCY] Health Alert – ${patientName}`
    }));
    console.log('[SNS] Emergency alert sent successfully');
    return true;
  } catch (err) {
    console.error('[SNS] Alert failed:', err.message);
    return false;
  }
}

// ─── POST /api/health — Add Health Data ────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const {
      patientType = 'adult',
      childAgeGroup,
      bloodPressure, sugarLevel, heartRate, oxygenLevel, temperature, symptoms,
      currentMedicines
    } = req.body;

    // Classify heart rate
    const heartRateStatus = classifyHeartRate(heartRate, patientType, childAgeGroup);

    // Analyze condition & risk
    const analysis = analyzeCondition({
      bloodPressure, sugarLevel, heartRate, oxygenLevel, temperature, symptoms, heartRateStatus
    });

    const healthData = new HealthData({
      ...req.body,
      heartRateStatus,
      possibleCondition: analysis.possibleCondition,
      riskLevel: analysis.riskLevel,
      recommendedAction: analysis.recommendedAction,
      isEmergency: analysis.isEmergency,
      prescription: analysis.prescription,
      emergencyStatus: analysis.emergencyStatus,
      alertSent: false
    });

    await healthData.save();

    // Populate patient info for SNS
    if (analysis.isEmergency) {
      await healthData.populate('patient');
      const alertSent = await sendSNSAlert(
        healthData.patient?.name,
        analysis.possibleCondition,
        analysis.riskLevel
      );
      healthData.alertSent = alertSent;
      await healthData.save();
    }

    res.status(201).json(healthData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ─── GET /api/health/patient/:patientId ─────────────────────────────────────
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const data = await HealthData
      .find({ patient: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/health/emergencies ─────────────────────────────────────────────
router.get('/emergencies', auth, async (req, res) => {
  try {
    const emergencies = await HealthData
      .find({ isEmergency: true })
      .populate('patient')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── PUT /api/health/:id/prescription — Doctor Review ────────────────────────
router.put('/:id/prescription', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Only doctors can prescribe' });
    }
    const { prescribedMedicines, dosage, medicineTimings, doctorNotes, doctorApproved } = req.body;
    const record = await HealthData.findByIdAndUpdate(
      req.params.id,
      {
        prescribedMedicines,
        dosage,
        medicineTimings,
        doctorNotes,
        doctorApproved: doctorApproved || false,
        reviewedBy: req.user.id
      },
      { new: true }
    ).populate('patient');
    if (!record) return res.status(404).json({ msg: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
