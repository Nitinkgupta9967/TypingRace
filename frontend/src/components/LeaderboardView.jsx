import React, { useState, useEffect } from 'react';
import { Trophy, Award, Zap, Users, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardView() {
  const { token } = useAuth();
  const [tab, setTab] = useState('global'); // global, friends
  const [sortBy, setSortBy] = useState('rating'); // rating, best_wpm
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab, sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'friends' && token 
        ? `/api/leaderboards/friends` 
        : `/api/leaderboards/global?sortBy=${sortBy}`;
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="hud" style={{ padding: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div className="hud-label">HALL OF FAME · SEASON 04</div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy size={26} color="var(--amber)" /> GLOBAL STANDINGS
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${tab === 'global' ? 'btn-primary' : 'btn-ghost'}`} 
              style={{ fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setTab('global')}
            >
              <Globe size={14} /> Global Ranks
            </button>
            <button 
              className={`btn ${tab === 'friends' ? 'btn-violet' : 'btn-ghost'}`}
              style={{ fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setTab('friends')}
            >
              <Users size={14} /> Friends Ranks
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        {tab === 'global' && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '4px 12px', fontSize: '12px', borderColor: sortBy === 'rating' ? 'var(--cyan)' : undefined }}
              onClick={() => setSortBy('rating')}
            >
              Sort by Rating
            </button>
            <button 
              className="btn btn-ghost"
              style={{ padding: '4px 12px', fontSize: '12px', borderColor: sortBy === 'best_wpm' ? 'var(--cyan)' : undefined }}
              onClick={() => setSortBy('best_wpm')}
            >
              Sort by Peak WPM
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        <div style={{ border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden', background: 'rgba(5, 7, 13, 0.4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 100px', padding: '12px 16px', background: 'rgba(10, 14, 26, 0.8)', fontFamily: 'JetBrains Mono', fontWeight: '600', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <div>Rank</div>
            <div>Typist</div>
            <div style={{ textAlign: 'right' }}>Rating</div>
            <div style={{ textAlign: 'right' }}>Best WPM</div>
            <div style={{ textAlign: 'right' }}>Wins</div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              LOADING STANDINGS...
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              NO TYPIST RECORDS FOUND.
            </div>
          ) : (
            leaderboard.map((item, index) => {
              const rank = index + 1;
              let rankBadgeClass = 'badge-cyan';
              if (rank === 1) rankBadgeClass = 'badge-amber';
              if (rank === 2) rankBadgeClass = 'badge-violet';

              return (
                <div 
                  key={item.id} 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 120px 100px',
                    padding: '14px 16px',
                    alignItems: 'center',
                    borderTop: '1px solid var(--line)',
                    background: rank === 1 ? 'rgba(245, 158, 11, 0.05)' : undefined
                  }}
                >
                  <div>
                    <span className={`badge-sci ${rankBadgeClass}`}>#{rank}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: item.avatar_color || '#6ee3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#05070d', fontFamily: 'Rajdhani' }}>
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.username}</span>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--amber)', fontFamily: 'JetBrains Mono', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <Award size={12} /> {item.rating}
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--cyan)', fontFamily: 'JetBrains Mono', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <Zap size={12} /> {item.best_wpm || 0} WPM
                  </div>

                  <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--muted)' }}>
                    {item.wins} / {item.total_races}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
