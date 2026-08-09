import React, { useEffect, useState } from 'react';

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function Keyboard3D({ activeChar = '' }) {
  const [pressedKey, setPressedKey] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key.toUpperCase());
      setTimeout(() => setPressedKey(''), 150);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const targetUpper = (activeChar || '').toUpperCase();

  return (
    <div className="keyboard-3d-container">
      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-cyan)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
        ⌨️ Interactive 3D Mechanical Keycaps
      </div>

      {QWERTY_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="keycap-row">
          {row.map((char) => {
            const isPressed = pressedKey === char;
            const isTarget = targetUpper === char;

            let keyClass = 'keycap';
            if (isPressed || isTarget) {
              keyClass += ' keycap-active';
            }

            return (
              <div key={char} className={keyClass}>
                {char}
              </div>
            );
          })}
        </div>
      ))}

      {/* Spacebar Row */}
      <div className="keycap-row" style={{ marginTop: '4px' }}>
        <div 
          className={`keycap ${(pressedKey === ' ' || activeChar === ' ') ? 'keycap-active' : ''}`}
          style={{ width: '220px' }}
        >
          SPACE
        </div>
      </div>
    </div>
  );
}
