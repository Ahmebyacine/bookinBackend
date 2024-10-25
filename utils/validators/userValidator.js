const { check ,body} = require('express-validator');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const {User} = require('../../models/userModel');

exports.addUserValidator = [
    check('name')
      .notEmpty()
      .withMessage('User required')
      .isLength({ min: 3 })
      .withMessage('Too short User name'),
  
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in user'));
          }
        })
      ),
  
    check('password')
      .notEmpty()
      .withMessage('Password required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
          throw new Error('Password Confirmation incorrect');
        }
        return true;
      }),
  
    check('passwordConfirm')
      .notEmpty()
      .withMessage('Password confirmation required'),
      check('phone')
    .optional()
    .isMobilePhone(['ar-DZ'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  check('role').optional(),
  
    validatorMiddleware,
  ];
  exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name')
      .optional(),
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in user'));
          }
        })
      ),
    check('phone')
      .optional()
      .isMobilePhone(['ar-DZ'])
      .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
    validatorMiddleware,
  ];
  exports.updateUserPublicValidator = [
    body('name')
      .optional(),
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in user'));
          }
        })
      ),
    check('phone')
      .optional()
      .isMobilePhone(['ar-DZ'])
      .withMessage('Invalid phone number only accepted DZ Phone numbers'),
    validatorMiddleware,
  ];
  exports.changeUserPasswordValidator = [
    body('currentPassword')
      .notEmpty()
      .withMessage('You must enter your current password'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('You must enter the password confirm'),
    body('newPassword')
      .notEmpty()
      .withMessage('You must enter new password')
      .custom(async (val, { req }) => {
        // 1) Verify current password
        const user = await User.findById(req.user._id);
        if (!user) {
          throw new Error('There is no user for this id');
        }
        const isCorrectPassword = await bcrypt.compare(
          req.body.currentPassword,
          user.password
        );
        if (!isCorrectPassword) {
          throw new Error('Incorrect current password');
        }
  
        // 2) Verify password confirm
        if (val !== req.body.confirmPassword) {
          throw new Error('Password Confirmation incorrect');
        }
        return true;
      }),
    validatorMiddleware,
  ];