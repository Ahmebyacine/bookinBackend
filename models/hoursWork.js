const mongoose = require('mongoose');
const { Schema } = mongoose;
const workingHoursSchema = new Schema({
    day: { type: String, required: true },
    start: { type: String, required: true }, 
    end: { type: String, required: true }
  });
  const WorkingHours = mongoose.model('WorkingHours', workingHoursSchema);
  
  module.exports = { WorkingHours };  