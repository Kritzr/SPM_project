const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function sign(payload, expiresIn='1h'){
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verify(token){
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { sign, verify };
