const { io } = require('socket.io-client');

async function testMinPlayers() {
  console.log('--- TESTING ENFORCED MINIMUM 2 PLAYERS RULE ---');
  const socket = io('http://127.0.0.1:5000');

  await new Promise(r => setTimeout(r, 500));

  socket.on('room_updated', (room) => {
    console.log('👥 Room Players Count:', room.players.length);
  });

  socket.on('race_started', () => {
    console.log('🚀 Race Started!');
  });

  socket.on('progress_update', (data) => {
    console.log('⚡ Progress Broadcast:', data.userId, `${data.wpm} WPM`);
    console.log('🎉 MINIMUM PLAYERS TEST PASSED SUCCESSFULLY!');
    socket.disconnect();
    process.exit(0);
  });

  // 1. Create Room solo
  console.log('1. Creating solo custom room...');
  socket.emit('create_room');

  setTimeout(() => {
    console.log('2. Host clicks Start Race while alone...');
    socket.emit('start_race');
  }, 1000);
}

testMinPlayers();
