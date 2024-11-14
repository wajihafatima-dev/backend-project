require('dotenv').config();
const express = require('express');
const User = require('./models/User');
const connectDB = require('./db/config'); 
const authRoute = require('./routes/authRoute'); 
const cardRoute = require('./routes/productRoute'); 
const cartRoute = require('./routes/cartRoute'); 
const multer = require("multer");
const app = express();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const cors=require("cors");
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

connectDB();

const imageSchema = new mongoose.Schema({
    url: String,
  });
  
  const Image = mongoose.model("Image", imageSchema);
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  // Configure Multer for temporary file storage
  const upload = multer({ dest: "uploads/" });
  
  // Upload route
  app.post("/upload", upload.single("image"), async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // Save image URL in MongoDB
      const image = new Image({ url: result.secure_url });
      await image.save();
  
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
  
      res.status(200).json({ message: "Image uploaded and saved!", url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Image upload failed." });
    }
  });
  


app.use('/auth', authRoute);
app.use('/cards', cardRoute);
app.use('/carts', cartRoute);





app.get('/auth', async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to Backend');
});

module.exports = app; 
