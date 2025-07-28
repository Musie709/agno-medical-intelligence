const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; // In-memory user store (replace with DB in production)
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, licenseNumber, specialty, institution, role } = req.body;
  if (!email || !password || !firstName || !lastName || !licenseNumber || !specialty || !institution || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash, firstName, lastName, licenseNumber, specialty, institution, role });
  res.json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email, firstName: user.firstName, lastName: user.lastName }, JWT_SECRET, { expiresIn: '1h' });
  // Return all user fields except password
  const { password: _pw, ...userInfo } = user;
  res.json({ token, user: userInfo });
});

module.exports = router; 