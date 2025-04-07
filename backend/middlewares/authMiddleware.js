const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log("Received Authorization Header:", authHeader); // Debugging log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    console.log("Extracted Token:", token); // Debugging log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token: User not found' });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = { isAuthenticated };
