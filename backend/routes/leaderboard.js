const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { authMiddleware } = require('./auth');

// Global Leaderboards
router.get('/global', async (req, res) => {
  try {
    const sortBy = req.query.sortBy === 'best_wpm' ? 'best_wpm' : 'rating';
    const sql = `
      SELECT id, username, avatar_color, rating, xp, total_races, wins, best_wpm, avg_wpm 
      FROM users 
      ORDER BY ${sortBy} DESC 
      LIMIT 50
    `;
    const result = await db.query(sql);
    res.json({ leaderboard: result.rows });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboards' });
  }
});

// Friends Leaderboard
router.get('/friends', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = `
      SELECT u.id, u.username, u.avatar_color, u.rating, u.xp, u.total_races, u.wins, u.best_wpm, u.avg_wpm 
      FROM users u
      WHERE u.id = ? OR u.id IN (
        SELECT friend_id FROM friends WHERE user_id = ? AND status = 'accepted'
        UNION
        SELECT user_id FROM friends WHERE friend_id = ? AND status = 'accepted'
      )
      ORDER BY rating DESC
    `;
    const result = await db.query(sql, [userId, userId, userId]);
    res.json({ leaderboard: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch friends leaderboard' });
  }
});

module.exports = router;
