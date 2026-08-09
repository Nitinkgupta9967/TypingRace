import React from 'react';
import { Flag, CheckCircle2, Zap } from 'lucide-react';

export default function RaceTrack({ players = [], promptLength = 100, currentUserId }) {
  return (
    <div className="racing-track-hud">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div className="hud-label">
          <Zap size={14} /> LIVE RACE ARENA · SPRINT TRACK
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--cyan)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
          <Flag size={12} /> FINISH LINE
        </div>
      </div>

      {players.map((player) => {
        const charIndex = player.charIndex || 0;
        const pct = Math.min(100, promptLength > 0 ? Math.round((charIndex / promptLength) * 100) : 0);
        const isSelf = player.id === currentUserId;

        return (
          <div 
            key={player.id} 
            className="racing-lane-hud"
            style={{ borderColor: isSelf ? 'var(--cyan-dim)' : undefined }}
          >
            {/* Finish Line */}
            <div className="lane-finish-hud" />

            {/* Racer Avatar & Info */}
            <div 
              className="racer-hud-avatar" 
              style={{ left: `calc(${pct}% * 0.88 + 8px)` }}
            >
              <div 
                className="racer-hud-circle" 
                style={{ backgroundColor: player.avatarColor || '#6ee3ff', border: isSelf ? '2px solid #fff' : undefined }}
              >
                {player.username.charAt(0).toUpperCase()}
              </div>

              <div className="racer-hud-tag" style={{ color: isSelf ? 'var(--cyan)' : '#fff' }}>
                <span style={{ fontWeight: '700' }}>{player.username} {isSelf && '(You)'}</span>
                <span style={{ color: 'var(--amber)', marginLeft: '8px' }}>⚡ {player.wpm || 0} WPM</span>
                {player.finished && (
                  <span style={{ color: 'var(--cyan)', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <CheckCircle2 size={12} /> #{player.rank}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
