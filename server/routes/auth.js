const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { run, get } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashed, name || null]);
    const userId = result.lastID;
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userId, email, name: name || null } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await get('SELECT id, email, password, name FROM users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = router;
module.exports.authMiddleware = authMiddleware;
