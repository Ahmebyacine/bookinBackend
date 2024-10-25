const express = require('express');
const router = express.Router();
const { 
   addBooking,
   allBooking,
   getBookingEpmloyed, 
   getBookingId, 
   getBookingUser,
   updateBooking, 
   deleteBooking,
   getBookingStatistics,
   getBookingStatisticsUser,
   getBookingStatisticsMonthly
  } = require('../services/bookingServices');
  const {
    creatBookingValidator, updateBookingValidator 
  } = require('../utils/validators/bookingValidator');
const { idValidator } = require('../utils/validators/idValidator');
const {protect, allowedTo} = require('../services/authServices');

router.use(protect);
  
// add Booking 
router.post('/bookings',creatBookingValidator, addBooking);
// Get all bookings
router.get('/bookings', allBooking);
//GET all booking employed
router.get('/bookings/employee/:id',allowedTo('admin', 'employee'),idValidator, getBookingEpmloyed);
// Get a booking by ID
router.get('/bookings/:id',idValidator, getBookingId);
// Get a bookin by User Id 
router.get('/bookings/user/:id',idValidator, getBookingUser);
// Update a booking
router.patch('/bookings/:id', updateBooking);
// Delete a booking
router.delete('/bookings/:id',allowedTo('admin', 'employee'),idValidator, deleteBooking);
// GET Booking statistics 
router.get('/bookingsStatics',allowedTo('admin', 'employee'), getBookingStatistics);
// GET Booking Monthly Admin Side
router.get('/bookingsStaticsMonthly',allowedTo('admin'), getBookingStatisticsMonthly);
// Route to get booking statistics for a specific user
router.get('/bookingsStatics/:id',allowedTo('admin', 'employee'),idValidator, getBookingStatisticsUser);


module.exports = router;