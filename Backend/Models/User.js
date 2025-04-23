const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    enum: ['user', 'admin'],
    default: 'user'  // Default value for new users
  },
  address: {
    type: String,
    default: ''  // Default empty string, updated later
  }
});

module.exports = mongoose.model('User', userSchema);
