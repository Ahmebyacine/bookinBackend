const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.addServiceValidator = [

  check('name')
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ min: 3 })
    .withMessage('Service name must be at least 3 characters long'),

  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  check('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean value'),

  check('execution_time')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Execution time must be in the format HH:mm'),

    validatorMiddleware,
];
exports.updateServiceValidator = [
  check('id').isMongoId().withMessage('Invalid id format'),
  check('name')
    .notEmpty()
    .withMessage('Service name is required')
    .isLength({ min: 3 })
    .withMessage('Service name must be at least 3 characters long'),

  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  check('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean value'),

  check('execution_time')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Execution time must be in the format HH:mm'),

    validatorMiddleware,
];
