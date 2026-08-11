import React, { useState, useEffect } from 'react';
import { Users, ArrowRight, UserCheck, Sparkles, Hash } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function InviteModal() {
  const { socketUser, setCustomUsername, joinRoom } = useSocket();
  const { user } = useAuth();
  const [inviteRoomCode, setInviteRoomCode] = useState(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    // Check URL parameters for ?room=... invite link
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setInviteRoomCode(roomParam.trim());
      // Pre-fill name if user has one
      if (user && user.username) {
        setDisplayName(user.username);
      } else if (socketUser && socketUser.username && !socketUser.username.startsWith('Racer_')) {
        setDisplayName(socketUser.username);
      }
    }
  }, [user, socketUser]);

  if (!inviteRoomCode) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = displayName.trim() || (user ? user.username : (socketUser ? socketUser.username : 'SpeedRacer'));
    
    // Set custom display name for backend socket
    setCustomUsername(finalName);
    
    // Join room
    joinRoom(inviteRoomCode);
    
    // Clear URL invite parameter
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, document.title, url.pathname);
    } catch (err) {}

    // Close modal
    setInviteRoomCode(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '32px', maxWidth: '460px', textAlign: 'center' }}>
        
        {/* Neon Invite Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(177, 138, 255, 0.15)',
          border: '1px solid var(--violet-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 25px var(--violet-dim)'
        }}>
          <Users size={32} color="var(--violet)" />
        </div>

        <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '6px' }}>
          <Sparkles size={14} color="var(--cyan)" /> MULTIPLAYER ROOM INVITE
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--white)' }}>
          ENTER YOUR <span style={{ color: 'var(--cyan)' }}>RACER NAME</span>
        </h2>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '100px',
          background: 'rgba(110, 227, 255, 0.1)',
          border: '1px solid var(--cyan-dim)',
          color: 'var(--cyan)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          marginBottom: '20px'
        }}>
          <Hash size={13} /> INVITED TO ROOM: <b>{inviteRoomCode}</b>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Your Display Name For This Race:
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your racer tag (e.g. ApexTyper)..."
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
            <UserCheck size={18} /> ENTER ROOM & START RACING <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
