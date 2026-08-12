const roomManager = require('./roomManager');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../routes/auth');

module.exports = function (io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userRes = await db.query('SELECT id, username, avatar_color, rating, best_wpm, avg_wpm FROM users WHERE id = ?', [decoded.id]);
        if (userRes.rows.length > 0) {
          socket.user = userRes.rows[0];
        }
      }
      if (!socket.user) {
        // Guest user fallback
        const guestId = 'guest_' + Math.random().toString(36).substr(2, 6);
        socket.user = {
          id: guestId,
          username: 'Racer_' + guestId.substr(6),
          avatar_color: '#' + Math.floor(Math.random()*16777215).toString(16),
          rating: 1200,
          best_wpm: 0,
          avg_wpm: 0
        };
      }
      next();
    } catch (err) {
      next(); // Proceed as guest
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.username} (${socket.id})`);
    socket.emit('init_user', socket.user);
    let currentRoomId = null;

    // Update custom display name
    socket.on('set_custom_username', (name) => {
      if (name && typeof name === 'string' && name.trim().length > 0) {
        const cleanName = name.trim().substring(0, 20);
        socket.user.username = cleanName;
        socket.emit('init_user', socket.user);
      }
    });

    // Join Matchmaking Queue
    socket.on('join_queue', async () => {
      roomManager.addToQueue({ ...socket.user, socketId: socket.id });
      socket.emit('queue_status', { status: 'searching' });

      // Try finding match
      const match = roomManager.findMatch();
      if (match) {
        const { room, players } = match;
        // Assign prompt
        const promptRes = await db.query('SELECT * FROM prompts ORDER BY RANDOM() LIMIT 1');
        room.prompt = promptRes.rows[0] || {
          id: 'def',
          text: 'Practice typing speed and conquer your opponents in real-time online racing duels.',
          author: 'TypeRacer',
          difficulty: 'medium'
        };

        players.forEach(p => {
          const s = io.sockets.sockets.get(p.socketId);
          if (s) {
            s.join(room.id);
            s.emit('match_found', roomManager.serializeRoom(room));
          }
        });

        // Start countdown automatically for matched 1v1
        startCountdown(room);
      }
    });

    socket.on('leave_queue', () => {
      roomManager.removeFromQueue(socket.user.id);
      socket.emit('queue_status', { status: 'idle' });
    });

    // Start stealth 1v1 match (calibrated 5-10 WPM faster than user average)
    socket.on('start_bot_match', async () => {
      roomManager.removeFromQueue(socket.user.id);
      const roomId = 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const room = roomManager.createRoom(roomId, socket.user, false);
      
      // Calculate human user average WPM (default 60 if new user)
      const userAvgWpm = socket.user.avg_wpm && socket.user.avg_wpm > 0 ? Math.round(socket.user.avg_wpm) : 60;
      // Target WPM is 5 to 10 WPM faster than user average
      const targetWpm = userAvgWpm + 5 + Math.floor(Math.random() * 6);

      const realisticUsernames = [
        'Alex_Scribe', 'Jordan_Keys', 'Elena_Type', 'Marcus_88', 
        'Sam_Pro', 'Taylor_Vortex', 'Chris_Dash', 'Morgan_Swift', 
        'Riley_Fast', 'Casey_Type', 'David_Keys', 'Nico_Typist'
      ];
      const opponentName = realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)];
      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

      const botUser = {
        id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        username: opponentName,
        avatar_color: colors[Math.floor(Math.random() * colors.length)],
        rating: Math.max(1000, (socket.user.rating || 1200) + Math.floor(Math.random() * 40 - 20)),
        best_wpm: Math.round(targetWpm + 12),
        avg_wpm: targetWpm,
        targetWpm: targetWpm,
        isBot: true
      };

      roomManager.addPlayerToRoom(room, botUser);

      const promptRes = await db.query('SELECT * FROM prompts ORDER BY RANDOM() LIMIT 1');
      room.prompt = promptRes.rows[0] || {
        id: 'def',
        text: 'Master your typing speed against competitive typists and climb the global ladder.',
        author: 'TypeRacer'
      };

      socket.join(room.id);
      socket.emit('match_found', roomManager.serializeRoom(room));
      startCountdown(room);
    });

    // Create Private Room / Custom Lobby
    socket.on('create_room', async () => {
      const roomId = 'room_' + Math.random().toString(36).substr(2, 6);
      const room = roomManager.createRoom(roomId, socket.user, true);
      
      const promptRes = await db.query('SELECT * FROM prompts ORDER BY RANDOM() LIMIT 1');
      room.prompt = promptRes.rows[0] || { id: 'def', text: 'Ready, set, type fast to claim victory!', author: 'TypeRacer' };

      currentRoomId = roomId;
      socket.join(roomId);
      socket.emit('room_updated', roomManager.serializeRoom(room));
    });

    // Join Custom Room with Code
    socket.on('join_room', (rawRoomId) => {
      let roomId = (rawRoomId || '').trim().toLowerCase();
      if (roomId.includes('room=')) {
        roomId = roomId.split('room=')[1].split('&')[0];
      }
      if (!roomId.startsWith('room_')) {
        roomId = 'room_' + roomId.replace(/^room_?/, '');
      }

      const room = roomManager.getRoom(roomId);
      if (!room) {
        return socket.emit('error_msg', `Room '${rawRoomId}' not found. Please check the code.`);
      }
      if (room.state !== 'LOBBY' && room.state !== 'COUNTDOWN') {
        return socket.emit('error_msg', 'Race already in progress');
      }

      roomManager.addPlayerToRoom(room, socket.user);
      currentRoomId = roomId;
      socket.join(roomId);

      // Auto-friend players when joining an invited room
      if (socket.user && !socket.user.id.startsWith('guest_') && room.hostId && !room.hostId.startsWith('guest_') && room.hostId !== socket.user.id) {
        const recId = 'f_' + Date.now();
        db.query(
          `INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, 'accepted')`,
          [recId, socket.user.id, room.hostId]
        ).catch(() => {});
      }

      io.to(roomId).emit('room_updated', roomManager.serializeRoom(room));
    });

    // Host starts race manually (Ensures at least 2 players - auto-adds opponent if solo human)
    socket.on('start_race', () => {
      const room = roomManager.getRoom(currentRoomId);
      if (room && room.hostId === socket.user.id && room.state === 'LOBBY') {
        const humanCount = Array.from(room.players.values()).filter(p => !p.isBot).length;
        // If solo human in room, auto-add 1 bot
        if (humanCount < 2 && room.players.size < 2) {
          const userAvgWpm = (socket.user.avg_wpm && socket.user.avg_wpm > 0) ? Math.round(socket.user.avg_wpm) : 35;
          const targetWpm = userAvgWpm + 3 + Math.floor(Math.random() * 4);
          const realisticUsernames = [
            'Alex_Scribe', 'Jordan_Keys', 'Elena_Type', 'Marcus_88', 
            'Sam_Pro', 'Taylor_Vortex', 'Chris_Dash', 'Morgan_Swift', 
            'Riley_Fast', 'Casey_Type'
          ];
          const opponentName = realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)];
          const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

          const botUser = {
            id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            username: opponentName,
            avatar_color: colors[Math.floor(Math.random() * colors.length)],
            rating: Math.max(1000, (socket.user.rating || 1200) + Math.floor(Math.random() * 40 - 20)),
            best_wpm: Math.round(targetWpm + 10),
            avg_wpm: targetWpm,
            targetWpm: targetWpm,
            isBot: true
          };

          roomManager.addPlayerToRoom(room, botUser);
          io.to(room.id).emit('room_updated', roomManager.serializeRoom(room));
        }

        startCountdown(room);
      }
    });

    // Reset room back to LOBBY state for next round (Rematch)
    socket.on('reset_lobby', () => {
      const room = roomManager.getRoom(currentRoomId);
      if (room) {
        room.state = 'LOBBY';
        room.startTime = null;

        // Clean up temporary bots
        const botIds = Array.from(room.players.values()).filter(p => p.isBot).map(p => p.id);
        botIds.forEach(botId => room.players.delete(botId));

        // Reset all player stats
        room.players.forEach(p => {
          p.charIndex = 0;
          p.wpm = 0;
          p.accuracy = 100;
          p.errors = 0;
          p.finished = false;
          p.finishTimeMs = null;
          p.rank = null;
        });

        io.to(room.id).emit('room_updated', roomManager.serializeRoom(room));
      }
    });

    // Add Opponent option for lobby
    socket.on('add_bot', () => {
      const room = roomManager.getRoom(currentRoomId);
      if (room && room.state === 'LOBBY') {
        const userAvgWpm = (socket.user.avg_wpm && socket.user.avg_wpm > 0) ? Math.round(socket.user.avg_wpm) : 35;
        const targetWpm = userAvgWpm + 3 + Math.floor(Math.random() * 4);
        const realisticUsernames = [
          'Alex_Scribe', 'Jordan_Keys', 'Elena_Type', 'Marcus_88', 
          'Sam_Pro', 'Taylor_Vortex', 'Chris_Dash', 'Morgan_Swift', 
          'Riley_Fast', 'Casey_Type'
        ];
        const opponentName = realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)];
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

        const botUser = {
          id: 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          username: opponentName,
          avatar_color: colors[Math.floor(Math.random() * colors.length)],
          rating: Math.max(1000, (socket.user.rating || 1200) + Math.floor(Math.random() * 40 - 20)),
          best_wpm: Math.round(targetWpm + 10),
          avg_wpm: targetWpm,
          targetWpm: targetWpm,
          isBot: true
        };
        roomManager.addPlayerToRoom(room, botUser);
        io.to(currentRoomId).emit('room_updated', roomManager.serializeRoom(room));
      }
    });

    // Real-Time Typing Progress Event
    socket.on('typing_progress', (data) => {
      const { roomId, charIndex, wpm, accuracy, errors } = data;
      const room = roomManager.getRoom(roomId || currentRoomId);
      if (!room || room.state !== 'RACING') return;

      const player = room.players.get(socket.user.id);
      if (!player || player.finished) return;

      player.charIndex = charIndex;
      player.wpm = wpm;
      player.accuracy = accuracy;
      player.errors = errors;

      // Broadcast updated player states to room
      io.to(room.id).emit('progress_update', {
        userId: socket.user.id,
        charIndex,
        wpm,
        accuracy,
        errors
      });

      // Check if player completed full prompt text
      if (charIndex >= room.prompt.text.length && !player.finished) {
        handlePlayerFinished(room, player);
      }
    });

    // Chat in Lobby / Post-Race
    socket.on('send_chat', (text) => {
      const room = roomManager.getRoom(currentRoomId);
      if (room && text && text.trim()) {
        const msg = {
          id: Date.now(),
          sender: socket.user.username,
          avatarColor: socket.user.avatar_color,
          text: text.trim().substring(0, 150),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        room.chat.push(msg);
        io.to(room.id).emit('chat_received', msg);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      if (currentRoomId) {
        const room = roomManager.removePlayerFromRoom(currentRoomId, socket.user.id);
        if (room) {
          io.to(currentRoomId).emit('room_updated', roomManager.serializeRoom(room));
        }
      }
      roomManager.removeFromQueue(socket.user.id);
    });
  });

  // Countdown Helper
  function startCountdown(room) {
    room.state = 'COUNTDOWN';
    let count = 3;
    io.to(room.id).emit('room_updated', roomManager.serializeRoom(room));
    io.to(room.id).emit('countdown_tick', { count: String(count) });

    room.countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        io.to(room.id).emit('countdown_tick', { count: String(count) });
      } else {
        clearInterval(room.countdownTimer);
        room.state = 'RACING';
        room.startTime = Date.now();
        io.to(room.id).emit('room_updated', roomManager.serializeRoom(room));
        io.to(room.id).emit('race_started', { startTime: room.startTime });

        // Trigger Bot simulation if bot present
        room.players.forEach(p => {
          if (p.isBot) simulateBot(room, p);
        });
      }
    }, 1000);
  }

  // Human-like Bot Simulation (Stealth calibrated to user average)
  function simulateBot(room, botPlayer) {
    const humanPlayer = Array.from(room.players.values()).find(p => !p.isBot);
    const humanAvg = (humanPlayer && humanPlayer.avgWpm && humanPlayer.avgWpm > 0) ? humanPlayer.avgWpm : 35;
    const targetWpm = botPlayer.targetWpm || (humanAvg + 3 + Math.floor(Math.random() * 4));

    const promptLen = room.prompt.text.length;
    const totalTimeMs = (promptLen / 5 / targetWpm) * 60 * 1000;
    const intervalMs = 180;
    const totalSteps = totalTimeMs / intervalMs;
    let currentStep = 0;

    const botInterval = setInterval(() => {
      if (room.state !== 'RACING' || botPlayer.finished) {
        clearInterval(botInterval);
        return;
      }
      currentStep++;
      botPlayer.charIndex = Math.min(promptLen, Math.floor((currentStep / totalSteps) * promptLen));

      // Natural human typing speed micro-fluctuations (+/- 3 WPM)
      const wpmFluctuation = Math.floor(Math.random() * 7) - 3;
      botPlayer.wpm = Math.max(25, Math.round(targetWpm + wpmFluctuation));
      botPlayer.accuracy = Math.min(100, Math.max(94, 98 + (Math.floor(Math.random() * 3) - 1)));

      io.to(room.id).emit('progress_update', {
        userId: botPlayer.id,
        charIndex: botPlayer.charIndex,
        wpm: botPlayer.wpm,
        accuracy: botPlayer.accuracy,
        errors: 0
      });

      if (botPlayer.charIndex >= promptLen) {
        clearInterval(botInterval);
        handlePlayerFinished(room, botPlayer);
      }
    }, intervalMs);
  }

  // Handle Player Finishing Race - Graceful multi-player completion
  async function handlePlayerFinished(room, player) {
    if (player.finished || room.state === 'FINISHED') return;
    
    player.finished = true;
    player.finishTimeMs = Date.now() - (room.startTime || Date.now());
    
    // Calculate finished rank based on number of players already finished
    const finishedPlayers = Array.from(room.players.values()).filter(p => p.finished);
    player.rank = finishedPlayers.length;
    player.pointsGained = player.rank === 1 ? 25 : (player.rank === 2 ? 15 : 10);

    // Broadcast individual player completion
    io.to(room.id).emit('player_finished', {
      userId: player.id,
      rank: player.rank,
      wpm: player.wpm,
      accuracy: player.accuracy,
      finishTimeMs: player.finishTimeMs,
      pointsGained: player.pointsGained
    });

    // Update database for finished registered user
    if (player.id && !player.id.startsWith('guest_') && !player.isBot) {
      try {
        await db.query(
          `UPDATE users SET 
            total_races = total_races + 1,
            wins = wins + ${player.rank === 1 ? 1 : 0},
            rating = MAX(100, rating + ?),
            xp = xp + ?,
            best_wpm = MAX(best_wpm, ?),
            avg_wpm = ROUND((avg_wpm * total_races + ?) / (total_races + 1), 1)
           WHERE id = ?`,
          [player.pointsGained, Math.round((player.wpm || 0) * 2), player.wpm || 0, player.wpm || 0, player.id]
        );
      } catch (err) {
        console.error('Failed to update DB for finished player:', err.message);
      }
    }

    // Check if ALL human players or 1v1 match completed
    const humanPlayers = Array.from(room.players.values()).filter(p => !p.isBot);
    const allHumansFinished = humanPlayers.every(p => p.finished);

    if (allHumansFinished || room.players.size <= 2) {
      // Instant finish on 1v1 / solo match or when all human typists complete
      finishRoomRace(room);
    } else if (player.rank === 1 && !room.graceTimer) {
      // 2-second quick finish buffer for multi-player rooms
      room.graceTimer = setTimeout(() => {
        const unfinishedRivals = Array.from(room.players.values()).filter(p => !p.finished);
        let nextRank = finishedPlayers.length + 1;
        for (const rival of unfinishedRivals) {
          rival.finished = true;
          rival.rank = nextRank++;
          rival.pointsGained = -5;
        }
        finishRoomRace(room);
      }, 2000);
    }
  }

  // Finalize Room Race & Broadcast Standings
  async function finishRoomRace(room) {
    if (room.state === 'FINISHED') return;
    room.state = 'FINISHED';
    if (room.graceTimer) {
      clearTimeout(room.graceTimer);
      room.graceTimer = null;
    }

    const winner = Array.from(room.players.values()).find(p => p.rank === 1);

    // Record race entry in DB
    if (winner) {
      try {
        const raceId = 'race_' + Date.now();
        await db.query(
          `INSERT INTO races (id, room_id, prompt_text, winner_id) VALUES (?, ?, ?, ?)`,
          [raceId, room.id, room.prompt ? room.prompt.text : '', winner.id]
        );
      } catch (e) {}
    }

    // Emit final race_over results to all clients in the room
    io.to(room.id).emit('race_over', {
      results: Array.from(room.players.values()).sort((a, b) => a.rank - b.rank)
    });
  }
};
