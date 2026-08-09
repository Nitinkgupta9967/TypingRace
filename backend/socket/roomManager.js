const db = require('../db/db');

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Room object
    this.matchmakingQueue = []; // array of socket user objects
  }

  createRoom(roomId, hostUser, isPrivate = false) {
    const room = {
      id: roomId,
      hostId: hostUser.id,
      isPrivate: isPrivate,
      state: 'LOBBY', // LOBBY, COUNTDOWN, RACING, FINISHED
      players: new Map(), // userId -> player details
      prompt: null,
      startTime: null,
      countdownTimer: null,
      chat: []
    };
    this.addPlayerToRoom(room, hostUser);
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  addPlayerToRoom(room, user) {
    room.players.set(user.id, {
      id: user.id,
      username: user.username,
      avatarColor: user.avatar_color || user.avatarColor || '#3b82f6',
      rating: user.rating || 1200,
      bestWpm: user.best_wpm || user.bestWpm || 0,
      charIndex: 0,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      finished: false,
      finishTimeMs: null,
      rank: null,
      pointsGained: 0,
      isBot: !!user.isBot
    });
  }

  removePlayerFromRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.players.delete(userId);
    if (room.players.size === 0) {
      if (room.countdownTimer) clearInterval(room.countdownTimer);
      this.rooms.delete(roomId);
      return null;
    }

    // If host left, assign new host
    if (room.hostId === userId) {
      const nextHost = Array.from(room.players.keys())[0];
      room.hostId = nextHost;
    }
    return room;
  }

  addToQueue(socketUser) {
    // Prevent duplicate queueing
    if (!this.matchmakingQueue.some(p => p.id === socketUser.id)) {
      this.matchmakingQueue.push(socketUser);
    }
  }

  removeFromQueue(userId) {
    this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== userId);
  }

  findMatch() {
    if (this.matchmakingQueue.length >= 2) {
      const p1 = this.matchmakingQueue.shift();
      const p2 = this.matchmakingQueue.shift();
      const roomId = 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const room = this.createRoom(roomId, p1, false);
      this.addPlayerToRoom(room, p2);
      return { room, players: [p1, p2] };
    }
    return null;
  }

  serializeRoom(room) {
    return {
      id: room.id,
      hostId: room.hostId,
      isPrivate: room.isPrivate,
      state: room.state,
      players: Array.from(room.players.values()),
      prompt: room.prompt,
      startTime: room.startTime,
      chat: room.chat.slice(-30)
    };
  }
}

module.exports = new RoomManager();
