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
    try {
      let body = req.body;
      let existingUser = await User.findOne({ email: body.email });
      if (!existingUser) {
        res.status(401).send({
          isSuccessfull: false,
          data: null,
          message: "Invalid Credentials",
        });
        return;
      } else {
        let isCorrectPassword = await bcrypt.compare(
          body.password,
          existingUser.password
        );
        if (isCorrectPassword) {
          res.status(200).send({
            isSuccessfull: true,
            data: existingUser,
            token: await jwt.sign(
              { ...existingUser },
              process.env.SECURITY_KEY
            ),
            message: "User Login Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        isSuccessfull: false,
        data: null,
        message: "Internal Server Error",
      });
    }
  }),
  

module.exports = Route;
