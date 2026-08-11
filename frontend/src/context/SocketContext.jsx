import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [socketUser, setSocketUser] = useState(null);
  const [queueStatus, setQueueStatus] = useState('idle'); // idle, searching, matched
  const [room, setRoom] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [raceResults, setRaceResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const s = io('/', {
      auth: { token },
      autoConnect: true
    });

    s.on('connect', () => {
      console.log('[SocketClient] Connected:', s.id);
    });

    s.on('init_user', (userData) => {
      setSocketUser(userData);
    });

    s.on('error_msg', (msg) => {
      alert(msg);
    });

    s.on('queue_status', (data) => {
      setQueueStatus(data.status);
    });

    s.on('match_found', (roomData) => {
      setRoom(roomData);
      setQueueStatus('matched');
      setChatMessages(roomData.chat || []);
    });

    s.on('room_updated', (roomData) => {
      setRoom(roomData);
      setChatMessages(roomData.chat || []);
    });

    s.on('countdown_tick', (data) => {
      setCountdown(String(data.count));
      setRoom(prev => prev ? { ...prev, state: 'COUNTDOWN' } : null);
    });

    s.on('race_started', (data) => {
      setCountdown('GO!');
      setTimeout(() => setCountdown(null), 1200);
      setRoom(prev => prev ? { ...prev, state: 'RACING', startTime: data.startTime } : null);
    });

    s.on('progress_update', (data) => {
      setRoom(prev => {
        if (!prev) return null;
        const updatedPlayers = prev.players.map(p => {
          if (p.id === data.userId) {
            return {
              ...p,
              charIndex: data.charIndex,
              wpm: data.wpm,
              accuracy: data.accuracy,
              errors: data.errors
            };
          }
          return p;
        });
        return { ...prev, players: updatedPlayers };
      });
    });

    s.on('player_finished', (data) => {
      setRoom(prev => {
        if (!prev) return null;
        const updatedPlayers = prev.players.map(p => {
          if (p.id === data.userId) {
            return {
              ...p,
              finished: true,
              rank: data.rank,
              wpm: data.wpm,
              accuracy: data.accuracy,
              finishTimeMs: data.finishTimeMs,
              pointsGained: data.pointsGained
            };
          }
          return p;
        });
        return { ...prev, players: updatedPlayers };
      });
    });

    s.on('race_over', (data) => {
      setRaceResults(data.results);
      setRoom(prev => prev ? { ...prev, state: 'FINISHED' } : null);
    });

    s.on('chat_received', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

  const joinQueue = () => {
    if (socket) {
      socket.emit('join_queue');
      setQueueStatus('searching');
    }
  };

  const leaveQueue = () => {
    if (socket) {
      socket.emit('leave_queue');
      setQueueStatus('idle');
    }
  };

  const startBotMatch = () => {
    if (socket) {
      socket.emit('start_bot_match');
      setQueueStatus('matched');
    }
  };

  const createRoom = () => {
    if (socket) socket.emit('create_room');
  };

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const startRace = () => {
    if (socket) socket.emit('start_race');
  };

  const addBot = () => {
    if (socket) socket.emit('add_bot');
  };

  const sendProgress = (charIndex, wpm, accuracy, errors) => {
    if (socket && room) {
      socket.emit('typing_progress', { roomId: room.id, charIndex, wpm, accuracy, errors });
    }
  };

  const sendChat = (text) => {
    if (socket) socket.emit('send_chat', text);
  };

  const leaveRoom = () => {
    setRoom(null);
    setCountdown(null);
    setRaceResults(null);
    setQueueStatus('idle');
    window.history.pushState({}, '', '/');
  };

  const setCustomUsername = (newName) => {
    if (socket && newName) {
      socket.emit('set_custom_username', newName);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketUser,
        queueStatus,
        room,
        countdown,
        raceResults,
        chatMessages,
        joinQueue,
        leaveQueue,
        startBotMatch,
        createRoom,
        joinRoom,
        startRace,
        addBot,
        sendProgress,
        sendChat,
        leaveRoom,
        setCustomUsername
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
