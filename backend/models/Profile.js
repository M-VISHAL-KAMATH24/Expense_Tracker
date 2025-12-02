const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  job: String,
  avatar: { type: String, default: 'avatar1' }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
