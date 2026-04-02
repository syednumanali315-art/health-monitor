const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prescribedByName: { type: String }, // For self-tracked or legacy string
  isSelfTracked: { type: Boolean, default: false },
  name: { type: String, required: true },
  type: { type: String },
  dose: { type: String },
  timing: { type: String },
  duration: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
