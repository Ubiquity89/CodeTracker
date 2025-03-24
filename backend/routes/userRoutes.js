const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update user platforms
router.patch('/platforms', auth, async (req, res) => {
  try {
    const { platforms } = req.body;
    req.user.platforms = platforms;
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
