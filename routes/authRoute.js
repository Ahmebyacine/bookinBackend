const express = require('express');
const { login, signup } = require('../services/authServices');
const { signupValidator, loginValidator } = require('../utils/validators/authValidator');


const router = express.Router();

// Login route
router.post('/login',loginValidator, login);
router.post('/signup',signupValidator, signup);

module.exports = router;