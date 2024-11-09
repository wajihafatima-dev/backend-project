const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');

const Route = express.Router();
const JWT_SECRET = 'your_jwt_secret';

Route.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ firstName, lastName, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully',user });
    } catch (error) {
      res.status(500).json({ error: 'Error signing up' });
    }
  });

Route.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email&&password) {
    let user=await User.findOne(req.body).select("-password") 
    if (user) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful',user, token });
    } else{
        res.status(500).json({ error: 'user is not valid' });
    }  
  } else{
    console.error('Error in login:', error); 
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = Route;
