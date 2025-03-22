const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication Middleware: Verifies JWT and extracts user details
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract the actual token

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized: Token expired, please log in again" });
      }
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Fetch user details from database (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    // If user doesn't exist, reject request
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next(); // Proceed to next middleware or route
  } catch (error) {
    res.status(500).json({ message: "Server error: Authentication failed" });
  }
};

// Role-based Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
    next();
  };
};




module.exports = { authMiddleware, authorizeRoles };
