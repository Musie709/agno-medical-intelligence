const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Middleware for JWT auth (placeholder, to be implemented)
const requireAuth = (req, res, next) => {
  // TODO: Implement JWT verification
  next();
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { model, messages, ...rest } = req.body;
    const response = await openai.chat.completions.create({
      model,
      messages,
      ...rest,
    });
    res.json(response);
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    res.status(500).json({ error: 'OpenAI API error', details: error.message });
  }
});

module.exports = router; 