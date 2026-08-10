import React, { useState, useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';
import AudioEngine from '../utils/AudioEngine';

export default function TypingEngine({ promptText = '', disabled = false, startTime = null, onProgress, onFinish }) {
  const [typedText, setTypedText] = useState('');
  const [shaking, setShaking] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);

  // Synchronous refs for exact keystroke & error counting
  const totalKeystrokesRef = useRef(0);
  const errorsRef = useRef(0);

  useEffect(() => {
    if (startTime) {
      startTimeRef.current = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    // Reset state when prompt changes
    setTypedText('');
    totalKeystrokesRef.current = 0;
    errorsRef.current = 0;
    startTimeRef.current = null;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onProgress) {
      onProgress(0, 0, 100, 0);
    }
  }, [promptText]);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      // Auto-focus on start
      inputRef.current.focus();
    }
  }, [disabled]);

  const processTypedChar = (char) => {
    if (disabled || !promptText) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const nextCharIndex = typedText.length;
    if (nextCharIndex >= promptText.length) return;

    const expectedChar = promptText[nextCharIndex];
    const isCorrect = char === expectedChar;

    totalKeystrokesRef.current += 1;

    if (isCorrect) {
      const newTyped = typedText + char;
      setTypedText(newTyped);
      AudioEngine.playKeySound();

      // Precise Math Calculations
      const elapsedMins = (Date.now() - (startTimeRef.current || Date.now())) / 1000 / 60;
      const validMins = elapsedMins > 0.005 ? elapsedMins : 0.005;
      const currentWpm = Math.round((newTyped.length / 5) / validMins);
      
      const totalKeys = totalKeystrokesRef.current;
      const totalErrs = errorsRef.current;
      const correctKeys = Math.max(0, totalKeys - totalErrs);
      const currentAcc = totalKeys > 0 ? Math.min(100, Math.max(0, Math.round((correctKeys / totalKeys) * 100))) : 100;

      if (onProgress) {
        onProgress(newTyped.length, currentWpm, currentAcc, totalErrs);
      }

      if (newTyped.length >= promptText.length) {
        if (onFinish) onFinish(currentWpm, currentAcc);
      }
    } else {
      errorsRef.current += 1;
      setShaking(true);
      AudioEngine.playErrorSound();
      setTimeout(() => setShaking(false), 200);

      const elapsedMins = (Date.now() - (startTimeRef.current || Date.now())) / 1000 / 60;
      const validMins = elapsedMins > 0.005 ? elapsedMins : 0.005;
      const currentWpm = Math.round((typedText.length / 5) / validMins);

      const totalKeys = totalKeystrokesRef.current;
      const totalErrs = errorsRef.current;
      const correctKeys = Math.max(0, totalKeys - totalErrs);
      const currentAcc = totalKeys > 0 ? Math.min(100, Math.max(0, Math.round((correctKeys / totalKeys) * 100))) : 100;

      if (onProgress) {
        onProgress(typedText.length, currentWpm, currentAcc, totalErrs);
      }
    }
  };

  const handleBackspace = () => {
    if (disabled) return;
    if (typedText.length > 0) {
      setTypedText(prev => prev.slice(0, -1));
      AudioEngine.playKeySound();
    }
  };

  // Keyboard handler for Desktop
  const handleKeyDown = (e) => {
    if (disabled || !promptText) return;

    if (e.key === 'Backspace') {
      handleBackspace();
      return;
    }

    // Process single printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      processTypedChar(e.key);
      e.preventDefault();
    }
  };

  // Mobile virtual keyboard input handler
  const handleInputChange = (e) => {
    if (disabled || !promptText) return;
    const val = e.target.value;
    if (!val) return;

    // Iterate through input buffer characters (handles mobile predictive text & swipe)
    for (let i = 0; i < val.length; i++) {
      processTypedChar(val[i]);
    }
    // Clear input buffer for next keystrokes
    e.target.value = '';
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Render character spans with precise sci-fi styling
  const renderPrompt = () => {
    return promptText.split('').map((char, index) => {
      let className = 'char-pending';
      if (index < typedText.length) {
        className = typedText[index] === char ? 'char-correct' : 'char-wrong';
      } else if (index === typedText.length && !disabled) {
        className = 'char-cursor';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* Mobile Keyboard Trigger Button */}
      <button 
        className="mobile-keyboard-btn"
        onClick={focusInput}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 18px',
          borderRadius: '100px',
          background: isFocused ? 'rgba(110, 227, 255, 0.18)' : 'rgba(177, 138, 255, 0.18)',
          border: '1px solid var(--cyan-dim)',
          color: 'var(--cyan)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: isFocused ? '0 0 15px var(--cyan-dim)' : 'none'
        }}
      >
        <Keyboard size={18} color="var(--cyan)" />
        {disabled ? 'RACE NOT STARTED' : isFocused ? 'KEYBOARD ACTIVE — TYPE NOW' : 'TAP HERE TO OPEN KEYBOARD'}
      </button>

      {/* Typing Engine Visual Box */}
      <div 
        className={`typing-box-sci ${shaking ? 'shake' : ''}`}
        onClick={focusInput}
        style={{ cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.6 : 1, position: 'relative' }}
      >
        <input
          ref={inputRef}
          type="text"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            opacity: 0.01, 
            zIndex: 5, 
            cursor: 'text' 
          }}
          autoFocus
        />
        <div style={{ pointerEvents: 'none' }}>{renderPrompt()}</div>
      </div>

    </div>
  );
}
