import React, { useEffect, useRef } from 'react';

const WORDS = ['SPEED', 'FOCUS', 'ACCURACY', 'PRECISION', 'CONSISTENCY', 'MOMENTUM', 'RHYTHM', 'REFLEX', 'TEMPO', 'STREAK'];
const COLORS = ['#ffffff', '#e4e4e7', '#a1a1aa'];

export default function SceneBackground() {
  const streaksRef = useRef(null);
  const wordsRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    // Generate speed streaks (scaled for mobile vs desktop)
    if (streaksRef.current && streaksRef.current.children.length === 0) {
      const streakCount = isMobile ? 12 : 26;
      for (let i = 0; i < streakCount; i++) {
        const el = document.createElement('div');
        el.className = 'streak';
        const ang = Math.random() * 360;
        const maxDist = isMobile ? (window.innerWidth * 0.45) : (700 + Math.random() * 500);
        const dur = 1.6 + Math.random() * 2.2;
        const delay = -Math.random() * 4;
        el.style.setProperty('--ang', ang + 'deg');
        el.style.setProperty('--dist', maxDist + 'px');
        el.style.setProperty('--dur', dur + 's');
        el.style.setProperty('--delay', delay + 's');
        el.style.setProperty('--streak-color', COLORS[Math.floor(Math.random() * COLORS.length)]);
        streaksRef.current.appendChild(el);
      }
    }

    // Generate flying background words ONLY on desktop screens (innerWidth > 768)
    if (!isMobile && wordsRef.current && wordsRef.current.children.length === 0) {
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'fly-word';
        el.textContent = WORDS[i % WORDS.length];
        const sx = 30 + Math.random() * 18;
        const sy = -30 + Math.random() * 90;
        const dx = 78 + Math.random() * 55;
        const dy = sy * 2.3;
        const sc = 1.6 + Math.random() * 1.1;
        const dur = 5 + Math.random() * 3.5;
        const delay = -Math.random() * 8;
        el.style.setProperty('--sx', sx + 'vw');
        el.style.setProperty('--sy', sy + 'px');
        el.style.setProperty('--dx', dx + 'vw');
        el.style.setProperty('--dy', dy + 'px');
        el.style.setProperty('--sc', sc);
        el.style.setProperty('--dur', dur + 's');
        el.style.setProperty('--delay', delay + 's');
        wordsRef.current.appendChild(el);
      }
    }
  }, []);

  return (
    <>
      <div className="scene">
        <div className="grid-floor" />
        <div className="grid-ceiling" />
        <div className="horizon-glow" />
        <div id="streaks" ref={streaksRef} />
        <div id="words" ref={wordsRef} />
      </div>
      <div className="vignette" />
      <div className="grain" />
    </>
  );
}
