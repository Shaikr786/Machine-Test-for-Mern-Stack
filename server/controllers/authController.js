const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// Login Controller
const login = async (req, res) => {
    try {
        // console.log("Login Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: { $regex: new RegExp(email, "i") } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 86400000 });

        res.json({ 
            success: true,
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Register Controller
const register = async (req, res) => {
    try {
        // console.log("Register Request Body:", req.body);

        const { name, email, password, role = "agent" } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        const token = generateToken(user);

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 86400000 });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Profile (Protected)
const getUserProfile = async (req, res) => {
    try {
        // console.log("User ID from token:", req.user.id);

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login, register, getUserProfile };
