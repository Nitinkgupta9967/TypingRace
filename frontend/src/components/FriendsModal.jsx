import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Check, Search, Share2, Zap, Copy, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function FriendsModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const { createRoom } = useSocket();
  const [activeTab, setActiveTab] = useState('list'); // list, add, invite
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchFriends();
    }
  }, [isOpen, token]);

  const fetchFriends = async () => {
    try {
      const res = await fetch('/api/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
        setPendingRequests(data.pendingRequests || []);
      }
    } catch (e) {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
      }
    } catch (e) {}
  };

  const addFriendDirect = async (targetUserId) => {
    try {
      const res = await fetch('/api/friends/add-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUserId })
      });
      if (res.ok) {
        fetchFriends();
        setSearchResults(prev => prev.map(u => u.id === targetUserId ? { ...u, isFriend: true } : u));
      }
    } catch (e) {}
  };

  const unfriend = async (friendUserId) => {
    try {
      const res = await fetch('/api/friends/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendUserId })
      });
      if (res.ok) {
        setFriends(prev => prev.filter(f => f.id !== friendUserId));
      }
    } catch (e) {}
  };

  const acceptRequest = async (requestId) => {
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        fetchFriends();
      }
    } catch (e) {}
  };

  const generateInviteLink = async () => {
    try {
      const roomId = 'room_' + Math.random().toString(36).substr(2, 6);
      const res = await fetch('/api/friends/invite-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roomId })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedLink(data.inviteUrl);
      }
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ padding: '28px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="hud-label">SQUAD DUELS & ROSTER</div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={22} color="var(--cyan)" /> FRIENDS & INVITES
            </h2>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <button 
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setActiveTab('list')}
          >
            My Friends ({friends.length})
          </button>
          <button 
            className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setActiveTab('add')}
          >
            Search Racers
          </button>
          <button 
            className={`btn ${activeTab === 'invite' ? 'btn-violet' : 'btn-ghost'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setActiveTab('invite')}
          >
            Shareable Room Link
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' && (
          <div>
            {pendingRequests.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: '600', color: 'var(--amber)', marginBottom: '8px' }}>
                  PENDING INVITES ({pendingRequests.length})
                </div>
                {pendingRequests.map(req => (
                  <div key={req.request_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{req.username}</span>
                    <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => acceptRequest(req.request_id)}>
                      <Check size={12} /> Accept
                    </button>
                  </div>
                ))}
              </div>
            )}

            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                No friends added yet. Generate a shareable room link to invite anyone to auto-friend and race!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {friends.map(friend => (
                  <div key={friend.id} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(5, 7, 13, 0.4)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: friend.avatar_color || '#6ee3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#05070d', fontFamily: 'Rajdhani' }}>
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{friend.username}</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)' }}>RATING: {friend.rating} | BEST: {friend.best_wpm || 0} WPM</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => { onClose(); createRoom(); }}
                      >
                        <Zap size={12} /> Challenge 1v1
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        title="Unfriend"
                        onClick={() => unfriend(friend.id)}
                      >
                        <UserMinus size={12} /> Unfriend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text"
                placeholder="Search by public username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
                <Search size={14} /> Search
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {searchResults.map(u => {
                const isAlreadyFriend = friends.some(f => f.id === u.id) || u.isFriend;

                return (
                  <div key={u.id} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(5, 7, 13, 0.4)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{u.username}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)' }}>RATING: {u.rating}</div>
                    </div>
                    {isAlreadyFriend ? (
                      <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--rose)' }} onClick={() => unfriend(u.id)}>
                        <UserMinus size={12} /> Unfriend
                      </button>
                    ) : (
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => addFriendDirect(u.id)}>
                        <UserPlus size={12} /> Add Friend
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'invite' && (
          <div>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Generate a shareable 1v1 room link. Anyone who joins your room via this link will automatically be added to your friend list!
            </p>

            <button className="btn btn-violet" style={{ width: '100%', padding: '12px', marginBottom: '16px' }} onClick={generateInviteLink}>
              <Share2 size={16} /> Generate Auto-Friend Room Link
            </button>

            {generatedLink && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(110, 227, 255, 0.1)', border: '1px solid var(--cyan-dim)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10.5px', color: 'var(--cyan)', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.08em' }}>SHAREABLE AUTO-FRIEND ROOM LINK</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={generatedLink} 
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '12px', fontFamily: 'JetBrains Mono', borderRadius: '6px' }}
                  />
                  <button className="btn btn-primary" style={{ padding: '8px 14px' }} onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
