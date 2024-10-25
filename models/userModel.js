const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'user', 'employee'],
    default: 'user',
  },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

module.exports = { User };