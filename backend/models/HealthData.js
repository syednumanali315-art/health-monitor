const mongoose = require('mongoose');

const HealthDataSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  bloodPressure: { systolic: Number, diastolic: Number },
  sugarLevel: { type: Number }, // mg/dL
  heartRate: { type: Number }, // bpm
  oxygenLevel: { type: Number }, // %
  temperature: { type: Number }, // F
  isEmergency: { type: Boolean, default: false },
  prescription: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HealthData', HealthDataSchema);
