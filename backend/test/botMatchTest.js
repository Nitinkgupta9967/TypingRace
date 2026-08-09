const { io } = require('socket.io-client');

async function testBotMatch() {
  console.log('--- TESTING 10s AI BOT MATCHMAKER OPTION ---');
  const socket = io('http://127.0.0.1:5000');

  await new Promise(r => setTimeout(r, 500));

  socket.on('match_found', (room) => {
    console.log('✅ AI Bot Match Found! Room ID:', room.id);
    console.log('👥 Players in Room:', room.players.map(p => `${p.username} (Bot: ${p.isBot})`).join(', '));
  });

  socket.on('countdown_tick', (data) => {
    console.log('⏱️ Countdown:', data.count);
  });

  socket.on('race_started', () => {
    console.log('🚀 AI Bot Race Started Successfully!');
    console.log('🎉 BOT MATCHMAKER TEST PASSED!');
    socket.disconnect();
    process.exit(0);
  });

  // Emulate user clicking Quick Play then choosing AI Bot
  console.log('1. Joining quick play queue...');
  socket.emit('join_queue');

  setTimeout(() => {
    console.log('2. Emulating 10s timeout trigger -> Requesting AI Bot Match...');
    socket.emit('start_bot_match');
  }, 1000);
}

testBotMatch();
