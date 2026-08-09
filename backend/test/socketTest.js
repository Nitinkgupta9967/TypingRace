const { io } = require('socket.io-client');

async function runSocketTest() {
  console.log('--- RUNNING SOCKET.IO REAL-TIME RACE TEST ---');

  const s1 = io('http://127.0.0.1:5000');
  const s2 = io('http://127.0.0.1:5000');

  await new Promise(r => setTimeout(r, 500));

  let roomId = null;

  s1.on('match_found', (room) => {
    console.log('✅ Player 1 Match Found:', room.id);
    roomId = room.id;
  });

  s2.on('match_found', (room) => {
    console.log('✅ Player 2 Match Found:', room.id);
  });

  s1.on('countdown_tick', (data) => {
    console.log('⏱️ Countdown:', data.count);
  });

  s1.on('race_started', () => {
    console.log('🚀 Race Started! Simulating typing to completion...');
    s1.emit('typing_progress', { roomId, charIndex: 150, wpm: 75, accuracy: 100, errors: 0 });
    s2.emit('typing_progress', { roomId, charIndex: 150, wpm: 65, accuracy: 98, errors: 1 });
  });

  s1.on('progress_update', (data) => {
    console.log('⚡ Progress Update:', data.userId, `${data.wpm} WPM`);
  });

  s1.on('race_over', (data) => {
    console.log('🏁 Race Over! Results:', data.results.length, 'players');
    console.log('🎉 REAL-TIME SOCKET TEST PASSED SUCCESSFULLY!');
    s1.disconnect();
    s2.disconnect();
    process.exit(0);
  });

  // Start Quick Play Queue
  s1.emit('join_queue');
  s2.emit('join_queue');
}

runSocketTest();
