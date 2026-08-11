import React, { useState } from 'react';
import { Volume2, VolumeX, Award, LogIn, Hash, Menu, X, Users, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AudioEngine from '../utils/AudioEngine';

export default function Navbar({ onOpenAuth, onOpenFriends, onOpenJoinRoom, onOpenLeaderboard, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMute = () => {
    const isMuted = AudioEngine.toggleMute();
    setMuted(isMuted);
  };

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

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px 14px', borderRadius: '100px', background: 'var(--panel)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: user.avatar_color || '#6ee3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.75rem',
                color: '#05070d'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name-text" style={{ fontWeight: '600', color: 'var(--white)' }}>{user.username}</span>
              <span style={{ color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'JetBrains Mono', fontSize: '11px' }}>
                <Award size={12} /> {user.rating}
              </span>
            </div>

            <button className="nav-link-btn" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={logout}>
              Logout
            </button>
          </div>
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
        </div>
      )}
    </header>
  );
}
