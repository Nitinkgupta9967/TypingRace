import React, { useEffect } from 'react';
import { Trophy, Zap, CheckCircle2, RotateCcw, Award, ArrowUpRight } from 'lucide-react';
import AudioEngine from '../utils/AudioEngine';

export default function PostRaceModal({ results = [], currentUserId, onRematch, onLeave }) {
  const winner = results.find(r => r.rank === 1);
  const isWinner = winner && winner.id === currentUserId;

  useEffect(() => {
    if (isWinner) {
      AudioEngine.playVictory();
    }
  }, [isWinner]);

  const selfStats = results.find(r => r.id === currentUserId) || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '36px', textAlign: 'center', maxWidth: '520px' }}>
        
        {/* Winner Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isWinner 
            ? 'linear-gradient(135deg, var(--amber), var(--rose))' 
            : 'linear-gradient(135deg, var(--cyan), var(--violet))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: isWinner 
            ? '0 0 30px rgba(245, 158, 11, 0.4)' 
            : '0 0 30px var(--cyan-dim)'
        }}>
          <Trophy size={32} color="#05070d" />
        </div>

        <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>
          {isWinner ? '🎉 VICTORY!' : 'RACE COMPLETE'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '24px' }}>
          {isWinner ? 'Unstoppable! You finished first on the track.' : `Winner: ${winner ? winner.username : 'Racer'} (${winner ? winner.wpm : 0} WPM)`}
        </p>

        {/* Self Stats Card */}
        {selfStats.wpm !== undefined && (
          <div style={{ padding: '16px', borderRadius: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px', background: 'rgba(5, 7, 13, 0.6)', border: '1px solid var(--line)' }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SPEED</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', fontWeight: '600', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px' }}>
                <Zap size={16} /> {selfStats.wpm} <span style={{ fontSize: '11px' }}>WPM</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ACCURACY</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', fontWeight: '600', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px' }}>
                <CheckCircle2 size={16} /> {selfStats.accuracy !== undefined ? selfStats.accuracy : 100}%
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RATING</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.4rem', fontWeight: '600', color: selfStats.pointsGained >= 0 ? 'var(--amber)' : 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '2px' }}>
                <Award size={16} /> {selfStats.pointsGained >= 0 ? `+${selfStats.pointsGained}` : selfStats.pointsGained}
              </div>
            </div>
          </div>
        )}

        {/* Final Standings Table */}
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            FINAL STANDINGS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((res) => (
              <div 
                key={res.id} 
                style={{ 
                  padding: '10px 14px', 
                  borderRadius: '10px',
                  background: 'rgba(5, 7, 13, 0.4)',
                  border: '1px solid var(--line)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderColor: res.id === currentUserId ? 'var(--cyan-dim)' : undefined 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge-sci ${res.rank === 1 ? 'badge-amber' : res.rank === 2 ? 'badge-cyan' : 'badge-violet'}`}>
                    #{res.rank}
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{res.username}</span>
                </div>
                <div style={{ display: 'flex', gap: '14px', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                  <span style={{ color: 'var(--cyan)' }}>{res.wpm} WPM</span>
                  <span style={{ color: 'var(--muted)' }}>{res.accuracy}% Acc</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '12px' }} onClick={onRematch}>
            <RotateCcw size={16} /> Play Again
          </button>
          <button className="btn btn-ghost" style={{ padding: '12px' }} onClick={onLeave}>
            <ArrowUpRight size={16} /> Back to Lobby
          </button>
        </div>

      </div>
    </div>
  );
}
