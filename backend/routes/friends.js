const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { authMiddleware } = require('./auth');

// Get user's friend list with stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    // Get confirmed friends
    const sql = `
      SELECT u.id, u.username, u.email, u.avatar_color, u.rating, u.best_wpm, u.avg_wpm, f.status, f.id as friend_record_id
      FROM friends f
      JOIN users u ON (
        (f.user_id = ? AND f.friend_id = u.id) OR
        (f.friend_id = ? AND f.user_id = u.id)
      )
      WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
    `;
    const friendsRes = await db.query(sql, [userId, userId, userId, userId]);
    
    // Get pending incoming requests
    const pendingSql = `
      SELECT f.id as request_id, u.id as user_id, u.username, u.avatar_color, u.rating
      FROM friends f
      JOIN users u ON f.user_id = u.id
      WHERE f.friend_id = ? AND f.status = 'pending'
    `;
    const pendingRes = await db.query(pendingSql, [userId]);

    res.json({
      friends: friendsRes.rows,
      pendingRequests: pendingRes.rows
    });
  } catch (err) {
    console.error('Friends fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Search users by public username only (privacy-first)
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) return res.json({ users: [] });

    const sql = `
      SELECT id, username, avatar_color, rating, best_wpm 
      FROM users 
      WHERE username LIKE ? AND id != ?
      LIMIT 10
    `;
    const searchRes = await db.query(sql, [`%${query}%`, req.user.id]);
    res.json({ users: searchRes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Send Friend Request
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (!targetUserId || targetUserId === userId) {
      return res.status(400).json({ error: 'Invalid user target' });
    }

    const checkSql = `
      SELECT id, status FROM friends 
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)
    `;
    const existing = await db.query(checkSql, [userId, targetUserId, targetUserId, userId]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: `Relationship already exists (${existing.rows[0].status})` });
    }

    const recId = 'f_' + Date.now();
    await db.query(
      `INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, 'pending')`,
      [recId, userId, targetUserId]
    );

    res.json({ message: 'Friend request sent', requestId: recId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Accept Friend Request
router.post('/accept', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.body;
    await db.query(
      `UPDATE friends SET status = 'accepted' WHERE id = ? AND friend_id = ?`,
      [requestId, req.user.id]
    );
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Direct Add Friend (Instant acceptance on invite or direct add)
router.post('/add-direct', authMiddleware, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (!targetUserId || targetUserId === userId) {
      return res.status(400).json({ error: 'Invalid user target' });
    }

    // Check existing
    const existing = await db.query(
      `SELECT id, status FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, targetUserId, targetUserId, userId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE friends SET status = 'accepted' WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
        [userId, targetUserId, targetUserId, userId]
      );
    } else {
      const recId = 'f_' + Date.now();
      await db.query(
        `INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, 'accepted')`,
        [recId, userId, targetUserId]
      );
    }

    res.json({ message: 'Friend added directly' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

// Remove Friend (Unfriend)
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { friendUserId } = req.body;
    const userId = req.user.id;

    if (!friendUserId) {
      return res.status(400).json({ error: 'Friend user ID required' });
    }

    await db.query(
      `DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, friendUserId, friendUserId, userId]
    );

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// Create Privacy-Friendly Shareable Room Link (No personal contact info requested or stored)
router.post('/invite-link', authMiddleware, async (req, res) => {
  try {
    const roomId = req.body.roomId || ('room_' + Math.random().toString(36).substr(2, 6));
    const inviteId = 'inv_' + Math.random().toString(36).substr(2, 6);

    await db.query(
      `INSERT INTO invites (id, sender_id, room_id, status) VALUES (?, ?, ?, 'sent')`,
      [inviteId, req.user.id, roomId]
    ).catch(() => {});

    const inviteUrl = `${req.protocol}://${req.get('host')}?room=${roomId}`;
    res.json({ inviteId, roomId, inviteUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create invite link' });
  }
});

module.exports = router;
