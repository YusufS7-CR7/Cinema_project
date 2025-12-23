const express = require('express');
const { get } = require('../db');
const { authMiddleware } = require('./auth');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await get('SELECT id, email, name FROM users WHERE id = ?', [req.userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected data', userId: req.userId });
});

module.exports = router;
