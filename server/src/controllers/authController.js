const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const checkUser = async (req, res) => {
    try {
        const { clerkid } = req.query;

        const existingUser = await User.findOne({ clerkid: clerkid });
        // Return the user if found
        if (existingUser) {

            return res.status(200).json({ user: existingUser });
        }
        // Return 404 if the user is not found
        return res.status(201).json({ error: "User not found." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// Register User
const registerUser = async (req, res) => {
    const { clerkid, email, name } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ clerkid, email, name });

        res.status(201).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {

            // Generate JWT Token
            const generateToken = (id) => {
                return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            };

            const session = generateToken(user._id);
            
            res.setHeader('Set-Cookie', `session=${session}; HttpOnly; Path=/`);

            // res.cookie('session', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
            //     sameSite: 'lax',
            //     maxAge: 3600000, // 1 hour
            //     path: '/',
            //   });              

            res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout User
const logoutUser = (req, res) => {
    res.clearCookie('session');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser, checkUser };