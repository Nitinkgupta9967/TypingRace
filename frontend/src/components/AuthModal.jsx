import React, { useState } from 'react';
import { X, LogIn, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await register(username, email, password);
      } else {
        await login(email || username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="hud-label">RACER AUTHENTICATION</div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>
              {isSignUp ? 'CREATE RACER TAG' : 'WELCOME BACK'}
            </h2>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fecdd3', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginBottom: '4px', letterSpacing: '0.08em' }}>
                RACERTAG (USERNAME)
              </label>
              <input 
                type="text" 
                required 
                placeholder="RacerTag"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginBottom: '4px', letterSpacing: '0.08em' }}>
              {isSignUp ? 'EMAIL ADDRESS' : 'USERNAME OR EMAIL'}
            </label>
            <input 
              type={isSignUp ? 'email' : 'text'}
              required 
              placeholder={isSignUp ? 'racer@example.com' : 'Enter username or email'}
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)', marginBottom: '4px', letterSpacing: '0.08em' }}>
              PASSWORD
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '100px', background: 'rgba(5, 7, 13, 0.8)', border: '1px solid var(--line)', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <button className="btn btn-primary" style={{ padding: '12px', marginTop: '8px' }} disabled={loading}>
            {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--muted)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>

      </div>
    </div>
  );
}
