import React, { useState, useEffect } from 'react';
import { UserCheck, ArrowRight, Sparkles, X, LogIn } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function GuestNameModal({ isOpen, onClose, onConfirm, onOpenAuth }) {
  const { socketUser, setCustomUsername } = useSocket();
  const { user } = useAuth();
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('tr_guest_name');
      if (savedName) {
        setGuestName(savedName);
      } else if (socketUser && socketUser.username && !socketUser.username.startsWith('Racer_')) {
        setGuestName(socketUser.username);
      } else {
        setGuestName('');
      }
    }
  }, [isOpen, socketUser]);

  if (!isOpen || user) return null; // Only prompt guests who are not logged in

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = guestName.trim() || 'SpeedRacer';
    
    // Save to localStorage so guest doesn't have to re-type next time
    localStorage.setItem('tr_guest_name', finalName);
    
    // Update socket username
    setCustomUsername(finalName);
    
    // Trigger callback (e.g. joinQueue, startBotMatch, etc.)
    if (onConfirm) {
      onConfirm(finalName);
    }
    
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

        {/* Holographic User Icon */}
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
          <UserCheck size={32} color="var(--cyan)" />
        </div>

        <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '6px' }}>
          <Sparkles size={14} color="var(--cyan)" /> GUEST RACER IDENTIFICATION
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.9rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--white)' }}>
          ENTER YOUR <span style={{ color: 'var(--cyan)' }}>RACER NAME</span>
        </h2>

        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px', lineHeight: '1.5' }}>
          Choose your display tag before entering the match arena!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Your Display Name:
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter display name (e.g. ApexTyper)..."
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '14px', fontSize: '15px', width: '100%', justifyContent: 'center' }}
          >
            CONFIRM & START RACING <ArrowRight size={16} />
          </button>

          {onOpenAuth && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { onClose(); onOpenAuth(); }}
              style={{ fontSize: '13px', padding: '10px' }}
            >
              <LogIn size={14} /> Already have an account? Sign in
            </button>
          )}
        </form>

      </div>
    </div>
  );
}
