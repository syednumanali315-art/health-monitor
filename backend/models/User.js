const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  mobile: { type: String },
  
  // Patient fields
  age: { type: Number, min: 0, max: 100 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  emergencyContact: { type: String },
  address: { type: String },
  history: { type: String },
  
  // Doctor fields
  specialization: { type: String },
  experience: { type: Number, min: 0 },
  hospital: { type: String },

  // Referencing (Optional convenience links)
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
