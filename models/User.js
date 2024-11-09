const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true,"Name is required"],
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