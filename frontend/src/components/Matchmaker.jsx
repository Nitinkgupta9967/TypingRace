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
        <div className="eyebrow">
          <span className="dot" /> 🎮 REAL-TIME BATTLES • GLOBAL LEADERBOARDS • LEVEL UP
        </div>

        <h1 className="headline">
          TYPE FAST.<br />
          <span className="line2">RACE FASTER.</span>
        </h1>

        <p className="sub">
          The ultimate typing race. Improve your speed, duel typists worldwide in sub-100ms real-time rooms, and climb the global leaderboards.
        </p>

        {/* Action Buttons */}
        <div className="hero-action-btns">
          <button className="btn btn-primary" onClick={handleStartRacing}>
            Start Racing Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#05070d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="btn btn-violet" onClick={onOpenCreateRoom}>
            <Users size={18} /> Create Room
          </button>

          <button className="btn btn-ghost" style={{ borderColor: 'var(--cyan-dim)', color: 'var(--cyan)' }} onClick={onOpenJoinRoom}>
            <LogIn size={18} color="var(--cyan)" /> Join Room
          </button>

          <button className="btn btn-ghost" onClick={onOpenFriends}>
            <Bot size={18} /> Invite Friends
          </button>
        </div>

        {/* Hero Stats Grid Bar */}
        <div className="hero-stats-grid">
          <div className="gamified-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--cyan)', fontFamily: 'Rajdhani, sans-serif' }}>50K+</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>RACES PLAYED</div>
          </div>

          <div className="gamified-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--violet)', fontFamily: 'Rajdhani, sans-serif' }}>25K+</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>ACTIVE TYPISTS</div>
          </div>

          <div className="gamified-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--amber)', fontFamily: 'Rajdhani, sans-serif' }}>120+</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>COUNTRIES</div>
          </div>

          <div className="gamified-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--emerald)', fontFamily: 'Rajdhani, sans-serif' }}>98 WPM</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px' }}>TOP PLAYER AVG</div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 2: CHOOSE YOUR MODE ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px' }}>ARENA SELECTION</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>
          CHOOSE YOUR <span style={{ color: 'var(--cyan)' }}>MODE</span>
        </h2>

        <div className="mode-cards-grid">
          <div className="gamified-card" onClick={handleStartRacing} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(110, 227, 255, 0.15)', border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Zap size={26} color="var(--cyan)" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--cyan)' }}>
              ⚡ RACE MODE
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              Compete against other typists in real-time 1v1 duels and multi-player rooms.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--cyan)', fontWeight: '600' }}>
              Enter Arena <ArrowRight size={14} />
            </div>
          </div>

          <div className="gamified-card" onClick={onOpenCreateRoom} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(177, 138, 255, 0.15)', border: '1px solid var(--violet-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Target size={26} color="var(--violet)" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--violet)' }}>
              🎯 PRACTICE MODE
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              Improve your speed and accuracy with targeted prompt drills and private lobby sessions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--violet)', fontWeight: '600' }}>
              Start Drill <ArrowRight size={14} />
            </div>
          </div>

          <div className="gamified-card" onClick={joinQueue} style={{ cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Clock size={26} color="var(--amber)" />
            </div>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--amber)' }}>
              ⏱️ TIME TRIAL
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5', marginBottom: '20px' }}>
              Test your limits under pressure and beat your personal best WPM score.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--amber)', fontWeight: '600' }}>
              Time Sprint <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 3: HOW TO PLAY ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px' }}>GUIDE</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>
          HOW TO <span style={{ color: 'var(--cyan)' }}>PLAY</span>
        </h2>

        <div className="steps-grid">
          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '8px' }}>
              01
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>
              TYPE THE WORDS
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
              Type the prompt characters as fast and accurately as you can on your keyboard.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: 'var(--violet)', marginBottom: '8px' }}>
              02
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>
              SPEED MOVES YOU
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
              Your real-time WPM score accelerates your racer pod along the racing highway.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: 'var(--amber)', marginBottom: '8px' }}>
              03
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>
              BEAT RIVALS
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
              Cross the finish line ahead of opponents to claim 1st place and gain rating points.
            </p>
          </div>

          <div className="gamified-card">
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: '700', color: 'var(--emerald)', marginBottom: '8px' }}>
              04
            </div>
            <h4 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>
              CLIMB THE RANKS
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
              Boost your overall WPM statistics, level up your profile, and climb the Hall of Fame.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 4: SEQUENTIAL COUNTDOWN ANIMATION DEMO ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px' }}>LIVE COUNTDOWN ENGINE</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>
          SYNCHRONIZED <span style={{ color: 'var(--violet)' }}>RACE LAUNCH</span>
        </h2>

        {/* Dynamic Live Sequential Preview Component */}
        <CountdownOverlay countdownStep={previewStep} />
      </div>

      {/* ---------------- SECTION 5: LIVE LEADERBOARD PREVIEW ---------------- */}
      <div>
        <div className="hud-label" style={{ marginBottom: '8px' }}>HALL OF FAME</div>
        <h2 className="gamified-title" style={{ fontSize: '2.2rem', marginBottom: '24px' }}>
          TOP <span style={{ color: 'var(--amber)' }}>TYPISTS</span> PREVIEW
        </h2>

        <div className="gamified-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci badge-amber">#1</span>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>NeonStrike</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: 'var(--amber)', fontSize: '15px' }}>
                135 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(5, 7, 13, 0.4)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci badge-violet">#2</span>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>GuyMaster</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: 'var(--violet)', fontSize: '15px' }}>
                128 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(110, 227, 255, 0.08)', border: '1px solid var(--cyan-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci badge-cyan">#3</span>
                <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--cyan)' }}>AceTyper (You)</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '700', color: 'var(--cyan)', fontSize: '15px' }}>
                110 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(5, 7, 13, 0.4)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>#4</span>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--muted)' }}>SpeedDemon</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '600', color: 'var(--muted)', fontSize: '14px' }}>
                98 WPM
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(5, 7, 13, 0.4)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge-sci" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>#5</span>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--muted)' }}>TypeNinja</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '600', color: 'var(--muted)', fontSize: '14px' }}>
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
