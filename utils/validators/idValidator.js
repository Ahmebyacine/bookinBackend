const { param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.idValidator = [
  param('id').isMongoId().withMessage('Invalid id format'),
    validatorMiddleware,
  ];