const mongoose = require('mongoose');
const { Schema } = mongoose;
const bookingSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  service_name: { type: String, required: true },
  service_price: { type: Number, required: true },
  service_execution_time: { type: String, required: true },
  booking_date: { type: Date, required: true },
  execution_time: { type: String, required: true },
  number: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  confirmed_by:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  confirmed_by_admin:{
    type: Boolean, default:false
  },
  created_at: { type: Date, default: Date.now },
});
  const Booking = mongoose.model('Booking', bookingSchema);
  
  module.exports = { Booking };