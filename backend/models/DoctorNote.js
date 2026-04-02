const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DoctorNote', doctorNoteSchema);
