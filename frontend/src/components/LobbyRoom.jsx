import React, { useState } from 'react';
import { Play, Copy, Check, UserPlus, Send, Shield, LogOut, Bot } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function LobbyRoom({ onOpenFriends }) {
  const { room, socket, socketUser, startRace, addBot, sendChat, chatMessages, leaveRoom } = useSocket();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [chatInput, setChatInput] = useState('');

  if (!room) return null;

  // Determine current player ID and username (supports both logged-in users and guests)
  const myUserId = user ? user.id : (socketUser ? socketUser.id : null);
  const myUsername = user ? user.username : (socketUser ? socketUser.username : null);
  
  // Host is room.hostId or the first player in room.players (room creator)
  const isHost = room.players.length > 0 && (
    (myUserId && room.hostId === myUserId) ||
    (myUserId && room.players[0].id === myUserId) ||
    (myUsername && room.players[0].username === myUsername)
  );

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}?room=${room.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChat(chatInput);
      setChatInput('');
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
      
      {/* Main Lobby Details */}
      <div className="hud">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="hud-label">CUSTOM LOBBY · SQUAD DUEL</div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '4px' }}>
              ROOM <span style={{ color: 'var(--cyan)' }}>#{room.id}</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }} onClick={copyInviteLink}>
              {copied ? <Check size={14} color="var(--cyan)" /> : <Copy size={14} />} 
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button className="btn btn-danger" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={leaveRoom}>
              <LogOut size={14} /> Leave
            </button>
          </div>
        </div>

        {/* Players List */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
            SLOTS OCCUPIED ({room.players.length}/4)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {room.players.map((p, idx) => (
              <div 
                key={p.id} 
                style={{ padding: '12px 16px', background: 'rgba(5, 7, 13, 0.6)', borderRadius: '12px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: p.avatarColor || '#6ee3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#05070d',
                  fontFamily: 'Rajdhani, sans-serif'
                }}>
                  {p.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {p.username}
                    {(p.id === room.hostId || idx === 0) && <Shield size={14} color="var(--amber)" title="Room Host" />}
                    {p.isBot && <Bot size={14} color="var(--cyan)" title="AI Agent Opponent" />}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    RATING: {p.rating} | BEST: {p.bestWpm || 0} WPM
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
          {isHost && (
            <button className="btn btn-primary" style={{ flex: 1, minWidth: '160px', padding: '14px' }} onClick={startRace}>
              <Play size={18} /> Start Race Now
            </button>
          )}

          <button className="btn btn-violet" style={{ padding: '14px 20px' }} onClick={addBot}>
            <UserPlus size={16} /> Add Agent
          </button>

          <button className="btn btn-ghost" style={{ padding: '14px 20px' }} onClick={onOpenFriends}>
            Invite Friends
          </button>
        </div>

        {!isHost && (
          <div style={{ textAlign: 'center', width: '100%', color: 'var(--muted)', fontSize: '12px', marginTop: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
            Waiting for Room Host to start the race... (You can add AI Agents using the button above!)
          </div>
        )}

      </div>

      {/* Lobby Chat */}
      <div className="hud" style={{ display: 'flex', flexDirection: 'column', height: '420px', padding: '16px' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: '12px' }}>
          💬 ARENA CHAT LOG
        </div>

        <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chatMessages.length === 0 ? (
            <div style={{ color: 'var(--muted-dim)', fontSize: '12px', fontFamily: 'JetBrains Mono', textAlign: 'center', marginTop: '40px' }}>
              No messages yet. Say hi!
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div key={msg.id} style={{ fontSize: '13px' }}>
                <span style={{ fontWeight: '700', color: msg.avatarColor || 'var(--cyan)' }}>{msg.sender}: </span>
                <span style={{ color: 'var(--white)' }}>{msg.text}</span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendChat} style={{ paddingTop: '10px', borderTop: '1px solid var(--line)', display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            placeholder="Type message..." 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', borderRadius: '100px' }}>
            <Send size={12} />
          </button>
        </form>
      </div>

    </div>
  );
}
