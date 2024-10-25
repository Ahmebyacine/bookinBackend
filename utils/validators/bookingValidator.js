const { check , param} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const { Service } = require('../../models/serviceModel');
const { User } = require('../../models/userModel');

exports.creatBookingValidator = [
  check('user_id')
  .notEmpty()
  .withMessage('user ID required')
  .isMongoId()
    .withMessage('Invalid User ID')
    .custom((val) => 
    User.findById(val).then((service) => {
      if (!service) {
        return Promise.reject(new Error('User not found'));
      }
    })
    ),
  check('service_id')
    .notEmpty()
    .withMessage('Service ID required')
    .isMongoId()
    .withMessage('Invalid Service ID')
    .custom((val) => 
      Service.findById(val).then((service) => {
        if (!service) {
          return Promise.reject(new Error('Service not found'));
        }
      })
    ),

  // Validate booking_date to be a valid date in the format 'YYYY-MM-DD'
  check('booking_date')
    .notEmpty()
    .withMessage('Booking date required')
    .isISO8601()
    .withMessage('Invalid date format (expected YYYY-MM-DD)'),

  // Validate execution_time to be a valid time in 'HH:mm' format
  check('execution_time')
    .notEmpty()
    .withMessage('Execution time required')
    .matches(/^([01]\d|[0-3]):([0-5]\d)$/)
    .withMessage('Invalid time format (expected HH:mm)'),

  // Validate number to be an integer greater than 0
  check('number')
    .notEmpty()
    .withMessage('Number of people required')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),
  validatorMiddleware,
];
exports.updateBookingValidator = [
  param('id').isMongoId().withMessage('Invalid id format'),
  

  // Validate booking_date to be a valid date in the format 'YYYY-MM-DD'
  check('booking_date')
    .notEmpty()
    .withMessage('Booking date required')
    .isISO8601()
    .withMessage('Invalid date format (expected YYYY-MM-DD)'),

  // Validate execution_time to be a valid time in 'HH:mm' format
  check('execution_time')
    .notEmpty()
    .withMessage('Execution time required')
    .matches(/^([01]\d|[0-3]):([0-5]\d)$/)
    .withMessage('Invalid time format (expected HH:mm)'),

  // Validate number to be an integer greater than 0
  check('number')
    .notEmpty()
    .withMessage('Number of people required')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),

  // Ensure status is one of the allowed values
  check('status')
    .optional()
    .isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Invalid status value'),

  // Validate confirmed_by is a valid MongoDB ObjectId when provided
  check('confirmed_by')
    .optional()
    .isMongoId()
    .withMessage('Invalid confirmed_by ID'),
  validatorMiddleware,
];