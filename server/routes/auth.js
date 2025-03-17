const express = require('express');
const { login, register, getUserProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // ✅ Ensure correct import

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, getUserProfile); // ✅ Protecting Route

module.exports = router;
