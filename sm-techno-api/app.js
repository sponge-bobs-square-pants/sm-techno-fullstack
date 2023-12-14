const express = require('express');

const connectDB = require('./DB/ConnectDB');
require('dotenv').config();
const port = process.env.PORT || 5000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const app = express();
const axios = require('axios');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Student = require('./Schemas/studentSchema');
app.use(express.json());
app.use(cors());

const AllStudentForm = async () => {
  const forms = Student.find();
  return forms;
};

app.post('/submitForm', upload.single('profileImage'), async (req, res) => {
  const formData = req.body;
  const profileImage = req.file;
  try {
    const imageBuffer = profileImage.buffer;
    const student = new Student({
      studentName: formData.studentName,
      mobileNumber: formData.mobileNumber,
      city: formData.city,
      cast: formData.cast,
      hobbies: formData.hobbies,
      profileImage: imageBuffer,
    });
    await student.save();
    // fs.unlinkSync(req.file.path);
    res.json({ success: true, message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ success: false, message: 'Error saving form data' });
  }
});

app.get('/getPDF', async (req, res) => {
  try {
    const formData = await AllStudentForm();
    const doc = new PDFDocument();
    const addImageFromBuffer = (buffer, x, y, options) => {
      const dataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      doc.image(dataUrl, x, y, options);
    };
    formData.forEach((data, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.text(`Form ${index + 1}`);
      doc.text(`Student Name: ${data.studentName}`);
      doc.text(`Mobile Number: ${data.mobileNumber}`);
      doc.text(`City: ${data.city}`);
      doc.text(`Cast: ${data.cast}`);
      doc.text(`Hobbies: ${data.hobbies.join(', ')}`);

      if (data.profileImage) {
        addImageFromBuffer(data.profileImage, 50, doc.y + 10, { width: 100 });
        doc.text('Profile Image:', 50, doc.y + 110);
        doc.moveDown();
      }
    });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=forms.pdf');
      res.end(pdfBuffer);
    });
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF' });
  }
});
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
