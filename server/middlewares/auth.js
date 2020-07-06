const jwt = require('jsonwebtoken');
const config = require('config');

exports.authMiddleware = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
    
  if (!token) {
    res.status(403).json({
      success: false,
      message: 'Not logged in'
    });
    return;
  }
  
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, config.get('jwt.secret'));
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message
    });
  }
};