const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ageGroup: { type: String, required: true },
  heartRate: { type: Number },
  bloodPressure: { type: String }, // '120/80'
  oxygen: { type: Number },
  sugar: { type: Number },
  temperature: { type: Number },
  
  // System calculated variables
  overallStatus: { type: String }, // Normal, Low, High, Critical
  conditionNow: [{ type: String }],
  risks: [{ type: String }],
  nextAction: [{ type: String }],
  isEmergency: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Vital', vitalSchema);
