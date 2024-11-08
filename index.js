require('dotenv').config();
const express = require('express');
const User = require('././models/User');
const connectDB = require('./db/config'); 
const authRoute = require('./controllers/authRoute'); 
const productRoute = require('./controllers/productRoute'); 
const cors=require("cors")
const app = express();
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(cors());
connectDB();
app.use('/auth', authRoute);
app.use('/products', productRoute);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
