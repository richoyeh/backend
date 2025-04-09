// Import dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route to fetch data
app.get('/api/drivers', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=10');
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'something unexpected happened' });
  }
});

app.use(express.static('uploads')); // Serve static files from the "uploads" directory

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // File will be uploaded to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid file name conflicts
  }
});

const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/api/submit', upload.single('fileUpload'), (req, res) => {
  const { fullName, email, phone, truckType } = req.body;
  const file = req.file; // The uploaded file will be available in req.file

  // Respond back to the frontend
  res.json({
    message: 'Driver registered successfully!',
    data: {
      fullName,
      email,
      phone,
      truckType,
      filePath: file.path // You can send the file path if needed for the frontend to display or download the file
    }
  });
});

// Start the server
// app.listen(port, () => {
 // console.log(`Server running succesfull`);
// });
