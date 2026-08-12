import React from 'react';
import { Flag, CheckCircle2, Zap } from 'lucide-react';

export default function RaceTrack({ players = [], promptLength = 100, currentUserId }) {
  const laneColors = ['#4f46e5', '#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed'];

  return (
    <div className="racing-track-hud">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div className="hud-label" style={{ color: '#09090b', fontWeight: '700' }}>
          <Zap size={15} color="#09090b" /> LIVE RACE ARENA · SPRINT TRACK
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#09090b', fontFamily: 'JetBrains Mono', fontWeight: '700', textTransform: 'uppercase' }}>
          <Flag size={14} color="#09090b" /> FINISH LINE
        </div>
      </div>

      {players.map((player, idx) => {
        const charIndex = player.charIndex || 0;
        const pct = Math.min(100, promptLength > 0 ? Math.round((charIndex / promptLength) * 100) : 0);
        const isSelf = player.id === currentUserId;
        const barColor = player.avatarColor || laneColors[idx % laneColors.length];

        return (
          <div 
            key={player.id} 
            className="racing-lane-hud"
            style={{ 
              border: isSelf ? '2px solid #09090b' : '1px solid #e2e8f0',
              background: isSelf ? '#ffffff' : '#f8fafc'
            }}
          >
            {/* Visual Fill Track Progress Bar */}
            <div 
              className="lane-progress-bar"
              style={{
                width: `${pct}%`,
                background: isSelf ? 'rgba(9, 9, 11, 0.08)' : 'rgba(79, 70, 229, 0.06)',
                borderRight: `3px solid ${barColor}`
              }}
            />

            {/* Racer Avatar & Info Tag */}
            <div 
              className="racer-hud-avatar" 
              style={{ left: `calc(${pct}% * 0.84 + 10px)` }}
            >
              <div 
                className="racer-hud-circle" 
                style={{ 
                  backgroundColor: barColor, 
                  border: isSelf ? '2px solid #09090b' : 'none' 
                }}
              >
                {player.username ? player.username.charAt(0).toUpperCase() : 'R'}
              </div>

              <div className="racer-hud-tag">
                <span style={{ fontWeight: '700', color: isSelf ? '#09090b' : '#334155' }}>
                  {player.username} {isSelf && '(You)'}
                </span>
                <span style={{ color: '#059669', marginLeft: '8px', fontWeight: '700' }}>
                  ⚡ {player.wpm || 0} WPM
                </span>
                {player.finished && (
                  <span style={{ color: '#d97706', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}>
                    <CheckCircle2 size={13} /> #{player.rank}
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
