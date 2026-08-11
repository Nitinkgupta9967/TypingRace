import React, { useState, useEffect } from 'react';
import { Users, ArrowRight, UserCheck, Sparkles, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function CreateRoomModal({ isOpen, onClose }) {
  const { socketUser, setCustomUsername, createRoom } = useSocket();
  const { user } = useAuth();
  const [hostName, setHostName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (user && user.username) {
        setHostName(user.username);
      } else if (socketUser && socketUser.username && !socketUser.username.startsWith('Racer_')) {
        setHostName(socketUser.username);
      } else {
        setHostName('');
      }
    }
  }, [isOpen, user, socketUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = hostName.trim() || (user ? user.username : (socketUser ? socketUser.username : 'RoomHost'));
    
    // Update backend socket username
    setCustomUsername(finalName);
    
    // Create new private room
    createRoom();
    
    // Close modal
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '32px', maxWidth: '460px', textAlign: 'center', position: 'relative' }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Neon Host Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(110, 227, 255, 0.15)',
          border: '1px solid var(--cyan-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 25px var(--cyan-dim)'
        }}>
          <Users size={32} color="var(--cyan)" />
        </div>

        <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '6px' }}>
          <Sparkles size={14} color="var(--cyan)" /> PRIVATE MULTIPLAYER LOBBY
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--white)' }}>
          CREATE <span style={{ color: 'var(--cyan)' }}>PRIVATE ROOM</span>
        </h2>

        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px', lineHeight: '1.5' }}>
          Set your host racer display name before creating your multiplayer lobby!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Your Host Display Name:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter host name (e.g. MasterTypist)..."
                maxLength={20}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(8, 12, 22, 0.9)',
                  border: '1px solid var(--cyan-dim)',
                  color: 'var(--white)',
                  fontSize: '15px',
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none',
                  boxShadow: '0 0 15px rgba(110, 227, 255, 0.15)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-violet"
            style={{ padding: '14px', fontSize: '15px', width: '100%', justifyContent: 'center' }}
          >
            <UserCheck size={18} /> CREATE ROOM & ENTER LOBBY <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
