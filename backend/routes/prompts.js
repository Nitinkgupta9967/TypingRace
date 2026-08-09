const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get random prompt
router.get('/random', async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    let sql = 'SELECT * FROM prompts';
    let params = [];
    if (difficulty) {
      sql += ' WHERE difficulty = ?';
      params.push(difficulty);
    }
    const result = await db.query(sql, params);
    if (result.rows.length === 0) {
      return res.json({
        id: 'default',
        text: 'The fast typist glides across the keyboard with laser focus, accuracy, and unwavering speed.',
        author: 'TypeRacer',
        category: 'general',
        difficulty: 'easy'
      });
    }
    const randomPrompt = result.rows[Math.floor(Math.random() * result.rows.length)];
    res.json(randomPrompt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

module.exports = router;
