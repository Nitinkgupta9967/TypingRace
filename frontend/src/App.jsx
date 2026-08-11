import React, { useState, useEffect } from 'react';
import SceneBackground from './components/SceneBackground';
import Navbar from './components/Navbar';
import Matchmaker from './components/Matchmaker';
import LobbyRoom from './components/LobbyRoom';
import TypingEngine from './components/TypingEngine';
import RaceTrack from './components/RaceTrack';
import PostRaceModal from './components/PostRaceModal';
import FriendsModal from './components/FriendsModal';
import LeaderboardView from './components/LeaderboardView';
import AuthModal from './components/AuthModal';
import CountdownOverlay from './components/CountdownOverlay';
import JoinRoomModal from './components/JoinRoomModal';
import MatchmakingModal from './components/MatchmakingModal';
import InviteModal from './components/InviteModal';
import CreateRoomModal from './components/CreateRoomModal';
import GuestNameModal from './components/GuestNameModal';
import { useSocket } from './context/SocketContext';
import { useAuth } from './context/AuthContext';
import AudioEngine from './utils/AudioEngine';

export default function App() {
  const { room, countdown, raceResults, joinRoom, sendProgress, leaveRoom, resetLobby } = useSocket();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('race'); // race, leaderboard
  const [authOpen, setAuthOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [guestNameModalOpen, setGuestNameModalOpen] = useState(false);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentAcc, setCurrentAcc] = useState(100);

  // Reset local WPM and accuracy when room state changes or new race starts
  useEffect(() => {
    if (room && (room.state === 'COUNTDOWN' || room.state === 'LOBBY')) {
      setCurrentWpm(0);
      setCurrentAcc(100);
    }
  }, [room?.state, room?.id, room?.prompt?.id]);

  // Play countdown audio ticks
  useEffect(() => {
    if (countdown) {
      AudioEngine.playBeep(countdown === 'GO!');
    }
  }, [countdown]);

  const handleTypingProgress = (charIndex, wpm, accuracy, errors) => {
    setCurrentWpm(wpm);
    setCurrentAcc(accuracy);
    sendProgress(charIndex, wpm, accuracy, errors);
  };

  const isRacingOrCountdown = room && (room.state === 'RACING' || room.state === 'COUNTDOWN' || room.state === 'FINISHED');
  const isLobby = room && room.state === 'LOBBY';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 3D Sci-Fi Grid Background Scene */}
      <SceneBackground />

      {/* Header Navigation */}
      <Navbar 
        onOpenAuth={() => setAuthOpen(true)}
        onOpenFriends={() => setFriendsOpen(true)}
        onOpenJoinRoom={() => setJoinRoomOpen(true)}
        onOpenLeaderboard={() => setActiveTab('leaderboard')}
        onOpenEditName={() => setGuestNameModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Workspace */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {activeTab === 'leaderboard' ? (
          <div style={{ padding: '120px 20px 80px' }}>
            <LeaderboardView />
          </div>
        ) : isLobby ? (
          <div style={{ padding: '120px 20px 80px' }}>
            <LobbyRoom onOpenFriends={() => setFriendsOpen(true)} />
          </div>
        ) : isRacingOrCountdown ? (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Race HUD Header */}
            <div className="hud">
              <div className="hud-top">
                <div className="hud-label">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
                  LIVE RACE ARENA · {room.prompt ? room.prompt.category.toUpperCase() : 'GENERAL'} ({room.prompt ? room.prompt.difficulty.toUpperCase() : 'MEDIUM'})
                </div>

                <div className="hud-metrics">
                  <div className="hud-metric">
                    <div className="val">{currentWpm}</div>
                    <div className="lbl">WPM</div>
                  </div>
                  <div className="hud-metric">
                    <div className="val">{currentAcc}%</div>
                    <div className="lbl">ACCURACY</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Fill */}
              <div style={{ height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min(100, room.prompt ? Math.round(((room.players.find(p => p.id === (user ? user.id : 'guest'))?.charIndex || 0) / room.prompt.text.length) * 100) : 0)}%`,
                    background: 'linear-gradient(90deg, var(--cyan), var(--violet))',
                    transition: 'width 0.1s linear'
                  }} 
                />
              </div>
            </div>

            {/* Sequential 3-2-1-GO Countdown Card Overlay */}
            {countdown && (
              <CountdownOverlay countdownStep={countdown} />
            )}

            {/* Live Race Track */}
            <RaceTrack 
              players={room.players} 
              promptLength={room.prompt ? room.prompt.text.length : 100}
              currentUserId={user ? user.id : 'guest'}
            />

            {/* Typing Engine Box */}
            <TypingEngine 
              promptText={room.prompt ? room.prompt.text : ''} 
              disabled={room.state !== 'RACING'} 
              startTime={room.startTime}
              onProgress={handleTypingProgress}
            />

            {/* Post Race Overlay */}
            {raceResults && (
              <PostRaceModal 
                results={raceResults}
                currentUserId={user ? user.id : 'guest'}
                onRematch={resetLobby}
                onLeave={leaveRoom}
              />
            )}

          </div>
        ) : (
          <Matchmaker 
            onOpenFriends={() => setFriendsOpen(true)}
            onOpenJoinRoom={() => setJoinRoomOpen(true)}
            onOpenCreateRoom={() => setCreateRoomOpen(true)}
            onOpenAuth={() => setAuthOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <FriendsModal isOpen={friendsOpen} onClose={() => setFriendsOpen(false)} />
      <JoinRoomModal isOpen={joinRoomOpen} onClose={() => setJoinRoomOpen(false)} />
      <CreateRoomModal isOpen={createRoomOpen} onClose={() => setCreateRoomOpen(false)} />
      <GuestNameModal isOpen={guestNameModalOpen} onClose={() => setGuestNameModalOpen(false)} onOpenAuth={() => setAuthOpen(true)} />
      <MatchmakingModal />
      <InviteModal />
    </div>
  );
}
