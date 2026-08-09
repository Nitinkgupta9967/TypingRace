import React, { useState } from 'react';
import { X, LogIn, ArrowRight, Zap, Hash } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export default function JoinRoomModal({ isOpen, onClose }) {
  const { joinRoom } = useSocket();
  const [roomCode, setRoomCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setErrorMsg('Please enter a valid room code.');
      return;
    }
    setErrorMsg('');
    joinRoom(roomCode.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="hud-label">CUSTOM LOBBY ACCESS</div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hash size={22} color="var(--cyan)" /> JOIN RACE ROOM
            </h2>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fecdd3', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginBottom: '6px', letterSpacing: '0.08em' }}>
              ROOM CODE OR INVITE URL
            </label>
            <input 
              type="text" 
              autoFocus
              placeholder="e.g. ROOM_JH276E or room_jh276e"
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line-strong)', color: '#fff', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '15px' }}>
            <Zap size={18} /> Enter Race Lobby <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          Tip: You can also paste a full invite link like <code>http://localhost:5000/?room=...</code>
        </div>

      </div>
    </div>
  );
}
