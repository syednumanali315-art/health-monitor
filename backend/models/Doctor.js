const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String },
  contact: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
