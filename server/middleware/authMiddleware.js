const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Step 1: Extract JWT token from Authorization header
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    // Step 2: Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Fetch user details from the database (excluding password)
    req.user = await User.findById(decoded.id).select("-password"); 

    // Step 4: Check if user exists
    if (!req.user) return res.status(401).json({ message: "Unauthorized: User not found" });

    // Step 5: Move to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};


// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
