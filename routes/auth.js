const router = require('express').Router();
const User = require('../models/User'); // Ensure this path matches your User model file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json("Email already exists");

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created!", userId: savedUser._id });
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json("Wrong credentials!");

        // Validate password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json("Wrong credentials!");

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        
        // Send user info (excluding password) and token
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;