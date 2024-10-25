const mongoose = require('mongoose');
const { Schema } = mongoose;
const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true},
    execution_time: { type: String},
    created_at: { type: Date, default: Date.now }
  });
  const Service = mongoose.model('Service', serviceSchema);
  module.exports = { Service };