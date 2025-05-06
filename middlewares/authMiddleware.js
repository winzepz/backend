const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware for general authentication
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: 'Not authorized, token verification failed',
        error: err.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, isAdmin };
