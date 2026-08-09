import React, { useState, useEffect, useRef } from 'react';
import AudioEngine from '../utils/AudioEngine';

export default function TypingEngine({ promptText = '', disabled = false, startTime = null, onProgress, onFinish }) {
  const [typedText, setTypedText] = useState('');
  const [shaking, setShaking] = useState(false);
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
    if (onProgress) {
      onProgress(0, 0, 100, 0);
    }
  }, [promptText]);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e) => {
    if (disabled || !promptText) return;

    // Start timer on first keystroke if not started
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
        AudioEngine.playKeySound();
      }
      return;
    }

    // Ignore non-printable keys
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    const nextCharIndex = typedText.length;
    if (nextCharIndex >= promptText.length) return;

    const expectedChar = promptText[nextCharIndex];
    const typedChar = e.key;
    const isCorrect = typedChar === expectedChar;

    totalKeystrokesRef.current += 1;

    if (isCorrect) {
      const newTyped = typedText + typedChar;
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
    <div 
      className={`typing-box-sci ${shaking ? 'shake' : ''}`}
      onClick={() => inputRef.current && inputRef.current.focus()}
      style={{ cursor: disabled ? 'not-allowed' : 'text', opacity: disabled ? 0.6 : 1 }}
    >
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        autoFocus
      />
      <div>{renderPrompt()}</div>
    </div>
  );
}
