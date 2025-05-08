module.exports = function isVerified(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
  
    // Admin Bypass 
    if (req.user.role === 'admin') {
      return next();
    }
  
    if (!req.user.isVerified) {
      return res.status(403).json({ message: "Forbidden: Please verify your account to perform this action." });
    }
  
    next();
  };
  