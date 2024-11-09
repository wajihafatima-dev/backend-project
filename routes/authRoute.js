const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const Route = express.Router();

Route.post('/signup', async (req, res) => {
    const {name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User registered successfully',user });
    } catch (error) {
      res.status(500).json({ error: 'Error signing up' });
    }
  });
  Route.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }
  
    try {
      const user = await User.findOne({ email }).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  });
  

module.exports = Route;
