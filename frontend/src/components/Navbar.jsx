import React, { useState } from 'react';
import { Volume2, VolumeX, Award, LogIn, Hash, Menu, X, Users, Trophy, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import AudioEngine from '../utils/AudioEngine';

export default function Navbar({ onOpenAuth, onOpenFriends, onOpenJoinRoom, onOpenLeaderboard, onOpenEditName, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const { socketUser } = useSocket();
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMute = () => {
    const isMuted = AudioEngine.toggleMute();
    setMuted(isMuted);
  };

  const displayName = user ? user.username : (socketUser ? socketUser.username : 'Racer_Guest');

  return (
    <header className="nav">
      {/* Logo Mark + Text */}
      <div className="logo" onClick={() => { setActiveTab('race'); setMobileMenuOpen(false); }}>
        <div className="logo-mark">
          <span />
          <span />
          <span />
        </div>
        <div className="logo-text">TYPE<b>RACE</b></div>
      </div>

      {/* Nav Links (Desktop) */}
      <ul className="nav-links">
        <li>
          <button 
            className={`nav-link-btn ${activeTab === 'race' ? 'active' : ''}`}
            onClick={() => setActiveTab('race')}
          >
            Race Arena
          </button>
        </li>
        <li>
          <button 
            className="nav-link-btn"
            style={{ color: 'var(--cyan)' }}
            onClick={onOpenJoinRoom}
          >
            <Hash size={14} color="var(--cyan)" /> Join Room
          </button>
        </li>
        <li>
          <button 
            className={`nav-link-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('leaderboard'); onOpenLeaderboard(); }}
          >
            Leaderboard
          </button>
        </li>
        <li>
          <button 
            className="nav-link-btn"
            onClick={onOpenFriends}
          >
            Friends & Duels
          </button>
        </li>
      </ul>

      {/* Nav Right */}
      <div className="nav-right">
        <button 
          className="nav-link-btn"
          style={{ padding: '8px' }}
          onClick={toggleMute}
          title={muted ? "Unmute Sound" : "Mute Sound"}
        >
          {muted ? <VolumeX size={16} color="var(--rose)" /> : <Volume2 size={16} color="var(--cyan)" />}
        </button>

        {/* User / Guest Racer Name Pill */}
        <button 
          className="nav-link-btn"
          onClick={onOpenEditName}
          title="Click to change display name"
          style={{ padding: '6px 12px', background: 'var(--panel)', border: '1px solid var(--line-strong)' }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: user ? (user.avatar_color || '#6ee3ff') : '#b18aff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.72rem',
            color: '#05070d'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="user-name-text" style={{ fontWeight: '600', color: 'var(--white)' }}>{displayName}</span>
          <Edit3 size={13} color="var(--cyan)" />
        </button>

        {user ? (
          <button className="nav-link-btn" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="nav-cta" onClick={onOpenAuth}>
            <LogIn size={14} /> Sign in
          </button>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} color="var(--cyan)" /> : <Menu size={20} color="var(--cyan)" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <button 
            className={`mobile-drawer-btn ${activeTab === 'race' ? 'active' : ''}`}
            onClick={() => { setActiveTab('race'); setMobileMenuOpen(false); }}
          >
            🏁 Race Arena
          </button>
          <button 
            className="mobile-drawer-btn"
            style={{ color: 'var(--cyan)' }}
            onClick={() => { onOpenJoinRoom(); setMobileMenuOpen(false); }}
          >
            <Hash size={16} color="var(--cyan)" /> Join Room Code
          </button>
          <button 
            className={`mobile-drawer-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('leaderboard'); onOpenLeaderboard(); setMobileMenuOpen(false); }}
          >
            <Trophy size={16} color="var(--amber)" /> Hall of Fame Leaderboard
          </button>
          <button 
            className="mobile-drawer-btn"
            onClick={() => { onOpenFriends(); setMobileMenuOpen(false); }}
          >
            <Users size={16} color="var(--violet)" /> Friends & Squad Duels
          </button>
          <button 
            className="mobile-drawer-btn"
            onClick={() => { onOpenEditName(); setMobileMenuOpen(false); }}
          >
            <Edit3 size={16} color="var(--cyan)" /> Edit Racer Display Name ({displayName})
          </button>
        </div>
      )}
    </header>
  );
}
