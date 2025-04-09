const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const DB_URI = "mongodb+srv://richie:Y2grO4Q0k4IlGi9U@richdriverproject.l5l7dwo.mongodb.net/?appName=richDriverProject"

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Driver schema and model
const driverSchema = new mongoose.Schema({
  fullName: { type: String, },
  email: { type: String, },
  phone: { type: String, },
  truckType: { type: String, },
  filePath: { type: String, },
  createdAt: { type: Date, default: Date.now },
});

const Driver = mongoose.model('Driver', driverSchema);

app.get('/', async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "server is active"
  })
})

// Route to fetch data
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find(); // Fetch all drivers from DB
console.log('taking server data');
    console.log(drivers);

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Something unexpected happened' });
  }
});

// Route to handle form submission
app.post('/api/submit', upload.single('fileUpload'), async (req, res) => {
  const { fullName, email, phone, truckType } = req.body;
  const file = req.file;

  try {
    const newDriver = new Driver({
      fullName,
      email,
      phone,
      truckType,
      filePath: file.path,
    });

    await newDriver.save();
    res.json({
      message: 'Driver registered successfully!',
      data: newDriver,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register driver', error });
  }
});

module.exports = (req, res) =>  (app(req, res));