const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
