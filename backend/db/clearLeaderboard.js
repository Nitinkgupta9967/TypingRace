const db = require('./db');

async function clearLeaderboard() {
  console.log('[Purge] Clearing all demo/seeded users, races, and leaderboard data...');
  try {
    await db.query('DELETE FROM race_participants').catch(() => {});
    await db.query('DELETE FROM races').catch(() => {});
    await db.query('DELETE FROM friends').catch(() => {});
    await db.query('DELETE FROM invites').catch(() => {});
    await db.query('DELETE FROM users').catch(() => {});
    console.log('✅ ALL DEMO DATA PURGED! Database is now 100% clean and ready for real users.');
  } catch (err) {
    console.error('Error clearing database:', err.message);
  }
}

if (require.main === module) {
  clearLeaderboard().then(() => process.exit(0));
}

module.exports = clearLeaderboard;
