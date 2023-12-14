const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  city: { type: String, required: true },
  cast: { type: String, required: true },
  hobbies: { type: [String], default: [] },
  profileImage: { type: Buffer }, // Store image data as Buffer
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
