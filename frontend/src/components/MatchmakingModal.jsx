import React, { useState, useEffect } from 'react';
import { Loader2, Zap, ArrowRight, X, Bot } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export default function MatchmakingModal() {
  const { queueStatus, leaveQueue, startBotMatch } = useSocket();
  const [searchSeconds, setSearchSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (queueStatus === 'searching') {
      setSearchSeconds(0);
      interval = setInterval(() => {
        setSearchSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setSearchSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [queueStatus]);

  if (queueStatus !== 'searching') return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '36px', textAlign: 'center', maxWidth: '480px' }}>
        
        {/* Holographic Radar Pulse Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(110, 227, 255, 0.12)',
          border: '1px solid var(--cyan-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 30px var(--cyan-dim)'
        }}>
          <Zap size={36} color="var(--cyan)" />
        </div>

        <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '8px' }}>
          MATCHMAKING ARENA ENGINE
        </div>

        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '8px', color: 'var(--cyan)' }}>
          SEARCHING FOR OPPONENT ({searchSeconds}s)
        </h2>

        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
          {searchSeconds >= 10 
            ? 'No player found after 10s. Continue with a random agent to race immediately!' 
            : 'Scanning global lobbies for typists of similar rating...'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {searchSeconds >= 10 && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '14px', fontSize: '15px' }}
              onClick={startBotMatch}
            >
              <Bot size={18} /> Continue with Random Agent <ArrowRight size={16} />
            </button>
          )}

          <button className="btn btn-danger" style={{ padding: '12px', fontSize: '14px' }} onClick={leaveQueue}>
            <X size={16} /> Cancel Search
          </button>
        </div>

      </div>
    </div>
  );
}
