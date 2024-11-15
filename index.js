require('dotenv').config();
const express = require('express');
const User = require('./models/User');
const connectDB = require('./db/config'); 
const authRoute = require('./routes/authRoute'); 
const cardRoute = require('./routes/productRoute'); 
const cartRoute = require('./routes/cartRoute'); 
// const multer = require("multer");
const app = express();
// const Image = require('./models/Image'); 
const cors=require("cors");
app.use(express.json());
app.use(cors());

connectDB();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const newImage = new Image({
//       name: req.body.name,
//       image: {
//         data: req.file.buffer,
//         contentType: req.file.mimetype,
//       },
//     });
    
//     await newImage.save();
//     res.status(200).json({ message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

  


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
