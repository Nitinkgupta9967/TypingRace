import React, { useState, useEffect } from 'react';
import { Play, Users, Bot, Zap, ArrowRight, Target, Clock, LogIn } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import CountdownOverlay from './CountdownOverlay';
import GuestNameModal from './GuestNameModal';

export default function Matchmaker({ onOpenFriends, onOpenJoinRoom, onOpenCreateRoom, onOpenAuth }) {
  const { joinQueue, socketUser } = useSocket();
  const { user } = useAuth();
  const [guestNameModalOpen, setGuestNameModalOpen] = useState(false);
  const [lapsCount, setLapsCount] = useState(128406);

  const handleStartRacing = () => {
    // If guest user without a set custom name, prompt GuestNameModal
    const savedName = localStorage.getItem('tr_guest_name');
    if (!user && !savedName && (!socketUser || !socketUser.username || socketUser.username.startsWith('Racer_'))) {
      setGuestNameModalOpen(true);
    } else {
      joinQueue();
    }
  };

  // Animated preview cycle for landing page countdown cards (3 -> 2 -> 1 -> GO!)
  const [previewStep, setPreviewStep] = useState('3');

  useEffect(() => {
    const steps = ['3', '2', '1', 'GO!'];
    let stepIdx = 0;
    const timer = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setPreviewStep(steps[stepIdx]);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const lapTimer = setInterval(() => {
      setLapsCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2200);
    return () => clearInterval(lapTimer);
  }, []);

  return (
    <main className="landing-container">
      
      {/* ---------------- SECTION 1: HERO BATTLE ARENA ---------------- */}
      <div>
        <div className="eyebrow" style={{ color: '#09090b', fontWeight: '700' }}>
          <span className="dot" style={{ background: '#09090b' }} /> 🎮 REAL-TIME BATTLES • GLOBAL LEADERBOARDS • LEVEL UP
        </div>

        <h1 className="headline" style={{ color: '#09090b' }}>
          TYPE FAST.<br />
          <span className="line2" style={{ color: '#09090b' }}>RACE FASTER.</span>
        </h1>

        <p className="sub" style={{ color: '#475569', fontSize: '18px' }}>
          The ultimate typing race. Improve your speed, duel typists worldwide in sub-100ms real-time rooms, and climb the global leaderboards.
        </p>

        {/* Action Buttons */}
        <div className="hero-action-btns">
          <button className="btn btn-primary" onClick={handleStartRacing}>
            Start Racing Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="btn btn-violet" onClick={onOpenCreateRoom}>
            <Users size={18} color="#09090b" /> Create Room
          </button>

          <button className="btn btn-ghost" onClick={onOpenJoinRoom}>
            <LogIn size={18} color="#09090b" /> Join Room
          </button>

          <button className="btn btn-ghost" onClick={onOpenFriends}>
            <Bot size={18} color="#09090b" /> Invite Friends
          </button>
        </div>

        {/* Hero Stats Grid Bar */}
        <div className="hero-stats-grid">
          <div className="gamified-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#09090b', fontFamily: 'Rajdhani, sans-serif' }}>50K+</div>
            <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', letterSpacing: '0.08em', fontWeight: '700' }}>RACES PLAYED</div>
          </div>

          <div className="gamified-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#09090b', fontFamily: 'Rajdhani, sans-serif' }}>25K+</div>
            <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', letterSpacing: '0.08em', fontWeight: '700' }}>ACTIVE TYPISTS</div>
          </div>

          <div className="gamified-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#d97706', fontFamily: 'Rajdhani, sans-serif' }}>120+</div>
            <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', letterSpacing: '0.08em', fontWeight: '700' }}>COUNTRIES</div>
          </div>

          <div className="gamified-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#059669', fontFamily: 'Rajdhani, sans-serif' }}>98 WPM</div>
            <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', letterSpacing: '0.08em', fontWeight: '700' }}>TOP PLAYER AVG</div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 2: CHOOSE YOUR MODE ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px', color: '#09090b', fontWeight: '700' }}>ARENA SELECTION</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px', color: '#09090b' }}>
          CHOOSE YOUR <span style={{ color: '#09090b' }}>MODE</span>
        </h2>

        <div className="mode-cards-grid">
          <div className="gamified-card" onClick={handleStartRacing} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Zap size={26} color="#09090b" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: '#09090b' }}>
              ⚡ RACE MODE
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
              Compete against other typists in real-time 1v1 duels and multi-player rooms.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#09090b', fontWeight: '700' }}>
              Enter Arena <ArrowRight size={14} />
            </div>
          </div>

          <div className="gamified-card" onClick={onOpenCreateRoom} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Target size={26} color="#09090b" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: '#09090b' }}>
              🎯 PRACTICE MODE
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
              Improve your speed and accuracy with targeted prompt drills and private lobby sessions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#09090b', fontWeight: '700' }}>
              Start Drill <ArrowRight size={14} />
            </div>
          </div>

          <div className="gamified-card" onClick={handleStartRacing} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fef3c7', border: '1px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Clock size={26} color="#d97706" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: '800', marginBottom: '8px', color: '#d97706' }}>
              ⏱️ TIME TRIAL
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
              Test your limits under pressure and beat your personal best WPM score.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#d97706', fontWeight: '700' }}>
              Time Sprint <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 3: HOW TO PLAY ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px', color: '#09090b', fontWeight: '700' }}>GUIDE</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px', color: '#09090b' }}>
          HOW TO <span style={{ color: '#09090b' }}>PLAY</span>
        </h2>

        <div className="steps-grid">
          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '800', color: '#09090b', marginBottom: '8px' }}>
              01
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: '#09090b' }}>
              TYPE THE WORDS
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
              Type the prompt characters as fast and accurately as you can on your keyboard.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '800', color: '#4f46e5', marginBottom: '8px' }}>
              02
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: '#09090b' }}>
              SPEED MOVES YOU
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
              Your real-time WPM score accelerates your racer pod along the racing highway.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '800', color: '#d97706', marginBottom: '8px' }}>
              03
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: '#09090b' }}>
              BEAT RIVALS
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
              Cross the finish line ahead of opponents to claim 1st place and gain rating points.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
              04
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: '800', marginBottom: '6px', color: '#09090b' }}>
              CLIMB THE RANKS
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
              Boost your overall WPM statistics, level up your profile, and climb the Hall of Fame.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 4: SEQUENTIAL COUNTDOWN ANIMATION DEMO ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px', color: '#09090b', fontWeight: '700' }}>LIVE COUNTDOWN ENGINE</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px', color: '#09090b' }}>
          SYNCHRONIZED <span style={{ color: '#09090b' }}>RACE LAUNCH</span>
        </h2>

        {/* Dynamic Live Sequential Preview Component */}
        <CountdownOverlay countdownStep={previewStep} />
      </div>

      {/* ---------------- SECTION 5: LIVE LEADERBOARD PREVIEW ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px', color: '#09090b', fontWeight: '700' }}>HALL OF FAME</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px', color: '#09090b' }}>
          TOP <span style={{ color: '#d97706' }}>TYPISTS</span> PREVIEW
        </h2>

        <div className="gamified-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fcd34d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: '#d97706', color: '#ffffff' }}>#1</span>
                <span style={{ fontWeight: '800', fontSize: '15px', color: '#09090b' }}>NeonStrike</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '800', color: '#d97706', fontSize: '15px' }}>
                135 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: '#4f46e5', color: '#ffffff' }}>#2</span>
                <span style={{ fontWeight: '800', fontSize: '15px', color: '#09090b' }}>GuyMaster</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '800', color: '#4f46e5', fontSize: '15px' }}>
                128 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: '#09090b', color: '#ffffff' }}>#3</span>
                <span style={{ fontWeight: '800', fontSize: '15px', color: '#09090b' }}>AceTyper (You)</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '800', color: '#09090b', fontSize: '15px' }}>
                110 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: '#64748b', color: '#ffffff' }}>#4</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>SpeedDemon</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: '#475569', fontSize: '14px' }}>
                98 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: '#64748b', color: '#ffffff' }}>#5</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#09090b' }}>TypeNinja</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: '#475569', fontSize: '14px' }}>
                92 WPM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Racer Name Prompt Modal */}
      <GuestNameModal
        isOpen={guestNameModalOpen}
        onClose={() => setGuestNameModalOpen(false)}
        onConfirm={() => joinQueue()}
        onOpenAuth={onOpenAuth}
      />

    </main>
  );
}
