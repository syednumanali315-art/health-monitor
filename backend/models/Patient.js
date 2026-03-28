const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  contact: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  medicalHistory: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
