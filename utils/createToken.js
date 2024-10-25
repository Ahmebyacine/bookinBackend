const jwt = require('jsonwebtoken');

const createToken = (payload) =>

  jwt.sign( payload , 'your_jwt_secret_key', { expiresIn: '1d' });

module.exports = createToken;