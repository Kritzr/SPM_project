const jwtUtil = require('../utils/jwt');

function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'Missing auth header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwtUtil.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
