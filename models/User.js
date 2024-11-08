const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true,"First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique:true,
      match:[/\S+@\S+\.\S+/,'invalid email']
    },
    password: {
      type: String,
      required: [true,"First name is required"],
      minlenght:[6,'password at least 6 cha']
    },
    created_at:{
      type:Date,
      default:Date.now
    },
    updated_at:{
      type:Date,
      default:Date.now
    }
    
  });
  module.exports = mongoose.model('users', UserSchema);