const jwt = require("jsonwebtoken");

// Optional auth - doesn't fail if no token, just sets req.user if valid
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Invalid token, but we don't fail - just continue without user
  }

  next();
};

module.exports = optionalAuth;
