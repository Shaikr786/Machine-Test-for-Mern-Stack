const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
const login = async (req, res) => {
    try {
        console.log("Login Request Body:", req.body); // ✅ Log request data
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Invalid password");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("Logged-in User:", user); // ✅ Ensure name is retrieved

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

  

// Register
const register = async (req, res) => {
    try {
        console.log("Register Request Body:", req.body); // ✅ Check if name is coming
        
        const { name, email, password, role = 'agent' } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, role }); 
        await user.save();

        console.log("Saved User:", user); // ✅ Log saved user

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

  

// Get Profile (Protected)
const getUserProfile = async (req, res) => {
    try {
        console.log("User ID from token:", req.user.id); // ✅ Check user ID from token

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Retrieved Profile:", user); // ✅ Ensure name is retrieved

        res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

  
module.exports = { login, register, getUserProfile };
