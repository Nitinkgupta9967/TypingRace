const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db/db');
const seed = require('./db/seed');
const authRoutes = require('./routes/auth').router;
const friendsRoutes = require('./routes/friends');
const leaderboardRoutes = require('./routes/leaderboard');
const promptsRoutes = require('./routes/prompts');
const setupRaceSockets = require('./socket/raceHandler');

const app = express();
const server = http.createServer(app);

// Enable CORS for React Frontend
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/prompts', promptsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Serve frontend static assets if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log('[Server] Production frontend dist found at:', frontendDist);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.warn('[Server] WARNING: Frontend dist folder not found at:', frontendDist);
}

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
setupRaceSockets(io);

// Auto-seed initial database data
seed().catch(err => console.error('Seed auto-run failed:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 TypeRacer Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Engine Ready`);
  console.log(`=================================================`);
});
