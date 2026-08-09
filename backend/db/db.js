const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let pgPool = null;
let sqliteDb = null;
let usePg = false;

// Check environment or PostgreSQL connection
const dbPath = path.join(__dirname, 'typeracer.sqlite');

function initDb() {
  const pgConnectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/typeracer';
  
  // Try connecting to PG if specified in env or by default
  if (process.env.USE_POSTGRES === 'true') {
    try {
      pgPool = new Pool({ connectionString: pgConnectionString, connectionTimeoutMillis: 2000 });
      usePg = true;
      console.log('[DB] Using PostgreSQL Database');
    } catch (err) {
      console.warn('[DB] PostgreSQL initialization failed, falling back to SQLite:', err.message);
      usePg = false;
    }
  }

  if (!usePg) {
    console.log('[DB] Using SQLite Database at', dbPath);
    sqliteDb = new sqlite3.Database(dbPath);
  }

  createTables();
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (usePg && pgPool) {
      // Convert SQLite ? to PG $1, $2
      let paramCount = 0;
      const pgSql = sql.replace(/\?/g, () => `$${++paramCount}`);
      pgPool.query(pgSql, params, (err, res) => {
        if (err) return reject(err);
        resolve({ rows: res.rows, rowCount: res.rowCount });
      });
    } else {
      const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
      if (isSelect) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows: rows || [], rowCount: rows ? rows.length : 0 });
        });
      } else {
        sqliteDb.run(sql, params, function(err) {
          if (err) return reject(err);
          resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
        });
      }
    }
  });
}

function createTables() {
  const sqlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_color TEXT DEFAULT '#3b82f6',
      rating INTEGER DEFAULT 1200,
      xp INTEGER DEFAULT 0,
      total_races INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      best_wpm REAL DEFAULT 0,
      avg_wpm REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      friend_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(friend_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS invites (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      room_id TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS races (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      prompt_text TEXT NOT NULL,
      winner_id TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS race_participants (
      id TEXT PRIMARY KEY,
      race_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      wpm REAL DEFAULT 0,
      accuracy REAL DEFAULT 0,
      rank INTEGER DEFAULT 1,
      points_gained INTEGER DEFAULT 0,
      FOREIGN KEY(race_id) REFERENCES races(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      author TEXT,
      category TEXT DEFAULT 'general',
      difficulty TEXT DEFAULT 'medium'
    )`
  ];

  for (const sql of sqlStatements) {
    query(sql).catch(err => console.error('[DB Schema Error]', err.message));
  }
}

initDb();

module.exports = {
  query,
  usePg: () => usePg
};
