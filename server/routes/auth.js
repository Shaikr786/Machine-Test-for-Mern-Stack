const express = require('express'); // Import Express framework to create a router
const { login, register, getUserProfile } = require('../controllers/authController'); // Import authentication controller functions
const { authMiddleware } = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router(); // Create an Express router instance

// ✅ Public Routes (No Authentication Required)

// 1️⃣ User Login
router.post('/login', login); 
// Users provide credentials (email & password) to obtain a JWT token

// 2️⃣ User Registration
router.post('/register', register); 
// Allows users to create an account (if registration is enabled)

// ✅ Protected Routes (Authentication Required)

// 3️⃣ Get User Profile
router.get('/me', authMiddleware, getUserProfile); 
// Retrieves logged-in user's profile using the token
// Requires authentication (JWT token in the Authorization header)

// ✅ Export the router so it can be used in the main app
module.exports = router;
