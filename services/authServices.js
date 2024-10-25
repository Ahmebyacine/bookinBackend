const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const createToken = require('../utils/createToken');
const ApiError = require('../utils/ApiError');
require('dotenv').config();

exports.signup = asyncHandler(async (req, res,next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
            
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password,
        });
        await user.save();
      const payload = { 
        userId: user._id, 
        role: user.role
      };
      const token = createToken(payload);
  
      res.json({ token });
    } catch (err) {
      console.error('Server error:', err);
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
});
exports.login = asyncHandler(async (req, res,next) => {
    const { email, password } = req.body;
  
    try {

      const user = await User.findOne({ email });
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!user || !isMatch) {
        return next(
          new ApiError(
            'Invalid credentials',
            400
          )
        );
      }
      const payload = { 
        userId: user._id, 
        role: user.role
      };
      const token = createToken(payload);
  
      res.json({ token });
    } catch (err) {
      console.error('Server error:', err);
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
  });

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new ApiError(
          'You are not login, Please login to get access this route',
          401
        )
      );
    }
    const decoded = jwt.verify(token,'your_jwt_secret_key');
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user belonging to this token no longer exists.',
          401
        )
      );
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return next(
      new ApiError(
        'Something went wrong while processing your request.',
        500
      )
    );
  }
};
exports.allowedTo = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError(
            'You are not allowed to access this route.',
            403
          )
        );
      }
      next();
    } catch (err) {
      return next(
        new ApiError(
          'Something went wrong while processing your request.',
          500
        )
      );
    }
  };
};


// if (currentUser.passwordChangedAt) {
//   const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
//   if (passChangedTimestamp > decoded.iat) {
//     return res.status(401).json({
//       message: 'User recently changed the password. Please log in again.',
//     });
//   }
// }
