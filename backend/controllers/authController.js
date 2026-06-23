const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const SELF_REGISTER_ROLES = ['sender', 'tracker'];

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN, }
    );

const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        let finalRole = 'tracker';
        if (role) {
            if (!SELF_REGISTER_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Invalid role selected' });
            }
            finalRole = role;
        }

        const hashedPassword = await bcrypt.hash(password, 10); //hashes password

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: finalRole
        });

        res.status(201).json({
            message: 'Registration successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user),
        });
    } catch (err) {
        res.status(500).json({ message: 'Registering error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //will not show passsword
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
};

module.exports = { register, login, getMe };