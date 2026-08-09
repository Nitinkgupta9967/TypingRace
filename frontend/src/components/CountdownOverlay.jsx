import React from 'react';

export default function CountdownOverlay({ countdownStep = '3' }) {
  const is3 = countdownStep === '3';
  const is2 = countdownStep === '2';
  const is1 = countdownStep === '1';
  const isGo = countdownStep === 'GO!' || countdownStep === 'GO';

  return (
    <div className="hud" style={{ textAlign: 'center', padding: '28px', marginBottom: '24px' }}>
      <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
        ARENA COUNTDOWN ENGINE · SYNCHRONIZED RACE LAUNCH
      </div>

      <div className="countdown-preview-grid">
        
        {/* Card 3 */}
        <div 
          className={`gamified-card ${is3 ? 'countdown-card-pop' : ''}`}
          style={{
            textAlign: 'center',
            borderColor: is3 ? 'var(--violet)' : 'var(--line)',
            boxShadow: is3 ? '0 0 35px var(--violet-dim), inset 0 0 20px rgba(177, 138, 255, 0.2)' : 'none',
            opacity: is3 ? 1 : 0.45,
            transform: is3 ? 'scale(1.04)' : 'scale(1)'
          }}
        >
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4.2rem', fontWeight: '700', color: is3 ? 'var(--violet)' : 'var(--muted)', textShadow: is3 ? '0 0 25px var(--violet-dim)' : 'none', lineHeight: '1' }}>
            3
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: is3 ? 'var(--violet)' : 'var(--muted-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
            GET READY
          </div>
        </div>

        {/* Card 2 */}
        <div 
          className={`gamified-card ${is2 ? 'countdown-card-pop' : ''}`}
          style={{
            textAlign: 'center',
            borderColor: is2 ? 'var(--cyan)' : 'var(--line)',
            boxShadow: is2 ? '0 0 35px var(--cyan-dim), inset 0 0 20px rgba(110, 227, 255, 0.2)' : 'none',
            opacity: is2 ? 1 : 0.45,
            transform: is2 ? 'scale(1.04)' : 'scale(1)'
          }}
        >
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4.2rem', fontWeight: '700', color: is2 ? 'var(--cyan)' : 'var(--muted)', textShadow: is2 ? '0 0 25px var(--cyan-dim)' : 'none', lineHeight: '1' }}>
            2
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: is2 ? 'var(--cyan)' : 'var(--muted-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
            GET READY
          </div>
        </div>

        {/* Card 1 */}
        <div 
          className={`gamified-card ${is1 ? 'countdown-card-pop' : ''}`}
          style={{
            textAlign: 'center',
            borderColor: is1 ? 'var(--rose)' : 'var(--line)',
            boxShadow: is1 ? '0 0 35px rgba(244, 63, 94, 0.5), inset 0 0 20px rgba(244, 63, 94, 0.2)' : 'none',
            opacity: is1 ? 1 : 0.45,
            transform: is1 ? 'scale(1.04)' : 'scale(1)'
          }}
        >
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4.2rem', fontWeight: '700', color: is1 ? 'var(--rose)' : 'var(--muted)', textShadow: is1 ? '0 0 25px rgba(244, 63, 94, 0.5)' : 'none', lineHeight: '1' }}>
            1
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: is1 ? 'var(--rose)' : 'var(--muted-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
            GET READY
          </div>
        </div>

        {/* Card GO! */}
        <div 
          className={`gamified-card ${isGo ? 'countdown-card-pop' : ''}`}
          style={{
            textAlign: 'center',
            borderColor: isGo ? 'var(--amber)' : 'var(--line)',
            background: isGo ? 'rgba(245, 158, 11, 0.12)' : 'var(--panel-strong)',
            boxShadow: isGo ? '0 0 45px rgba(245, 158, 11, 0.6), inset 0 0 25px rgba(245, 158, 11, 0.25)' : 'none',
            opacity: isGo ? 1 : 0.45,
            transform: isGo ? 'scale(1.06)' : 'scale(1)'
          }}
        >
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '4.2rem', fontWeight: '700', color: isGo ? 'var(--amber)' : 'var(--muted)', textShadow: isGo ? '0 0 30px rgba(245, 158, 11, 0.6)' : 'none', lineHeight: '1' }}>
            GO!
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: isGo ? 'var(--amber)' : 'var(--muted-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginTop: '6px' }}>
            TYPE FAST & WIN!
          </div>
        </div>

      </div>
    </div>
  );
}
