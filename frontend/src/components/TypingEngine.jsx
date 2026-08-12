import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, CheckCircle2 } from 'lucide-react';
import AudioEngine from '../utils/AudioEngine';

export default function TypingEngine({ promptText = '', disabled = false, startTime = null, onProgress, onFinish }) {
  const [typedText, setTypedText] = useState('');
  const [shaking, setShaking] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mobileInputValue, setMobileInputValue] = useState('');
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
    setMobileInputValue('');
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
      // Auto-focus input on race start
      try {
        inputRef.current.focus();
      } catch (err) {}
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

      // Precise WPM & Accuracy Math Calculations
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

  // Keyboard handler for Desktop physical keyboards
  const handleKeyDown = (e) => {
    if (disabled || !promptText) return;

    if (e.key === 'Backspace') {
      handleBackspace();
      e.preventDefault();
      return;
    }

    // Process single printable characters on physical keyboards (with e.preventDefault() to prevent duplicate onChange processing)
    if (e.key && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      processTypedChar(e.key);
      e.preventDefault();
    }
  };

  // Universal input handler for Mobile Touch Virtual Keyboards (Android Gboard / iOS Safari / Samsung)
  const handleInputChange = (e) => {
    if (disabled || !promptText) return;
    const val = e.target.value;
    if (!val) return;

    // Process each character typed on touch virtual keyboards
    for (let i = 0; i < val.length; i++) {
      processTypedChar(val[i]);
    }

    // Clear input buffer for next keystrokes
    setMobileInputValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      
      {/* Mobile Keyboard Trigger Action Bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          className="mobile-keyboard-btn"
          onClick={focusInput}
          disabled={disabled}
          type="button"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 20px',
            borderRadius: '100px',
            background: isFocused ? '#f1f5f9' : '#ffffff',
            border: isFocused ? '2px solid #09090b' : '1px solid #cbd5e1',
            color: '#09090b',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13.5px',
            fontWeight: '800',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: isFocused ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Keyboard size={18} color="#09090b" />
          {disabled 
            ? 'RACE NOT STARTED — WAIT FOR COUNTDOWN' 
            : isFocused 
              ? 'KEYBOARD ACTIVE — TYPE CHARACTERS BELOW' 
              : 'TAP HERE TO OPEN KEYBOARD & RACE'}
        </button>
      </div>

      {/* Main Sci-Fi Typing Box */}
      <div 
        className={`typing-box ${shaking ? 'shake' : ''}`}
        onClick={focusInput}
        onTouchStart={focusInput}
        style={{ cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.6 : 1, position: 'relative' }}
      >
        <div>{renderPrompt()}</div>
      </div>

      {/* Touch Input Bar for Mobile Keyboards */}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          value={mobileInputValue}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setMobileInputValue(e.target.value);
            handleInputChange(e);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={disabled ? "Race not active" : "Mobile typists: Tap here to type on your keyboard..."}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: '14px',
            background: '#ffffff',
            border: isFocused ? '2px solid #09090b' : '1px solid #cbd5e1',
            color: '#09090b',
            fontSize: '15px',
            fontFamily: 'JetBrains Mono, monospace',
            outline: 'none',
            boxShadow: isFocused ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none'
          }}
        />
      </div>

    </div>
  );
}
