const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseLink: { type: String },
  institution: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
