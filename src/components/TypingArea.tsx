
import React, { useState, useEffect, useCallback, useRef } from 'react';
import VirtualKeyboard from './VirtualKeyboard';
import { StageType, KeyPerformance, SessionSettings, KeystrokeEvent } from '../types';
import { Clock, Hash, Target, EyeOff, Ghost, Zap, RotateCcw } from 'lucide-react';
import { playKeySound } from '../services/soundEngine';
import InputLatencyChart from './InputLatencyChart';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingAreaProps {
  text: string;
  stage: StageType;
  settings: SessionSettings;
  isActive: boolean; // Added isActive prop
  ghostReplay?: KeystrokeEvent[];
  onFinish: (stats: {
    wpm: number;
    rawWpm: number;
    netWpm: number;
    accuracy: number;
    mistakes: number;
    time: number;
    keyPerformance: Record<string, KeyPerformance>;
    replay: KeystrokeEvent[];
  }) => void;
  onRestart: () => void;
}



const TypingArea: React.FC<TypingAreaProps> = ({ text, stage, settings, isActive, ghostReplay, onFinish, onRestart }) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [keyPerformance, setKeyPerformance] = useState<Record<string, KeyPerformance>>({});
  const [timeLeft, setTimeLeft] = useState<number>(settings.duration);
  const [recordedEvents, setRecordedEvents] = useState<KeystrokeEvent[]>([]);
  const [ghostIndex, setGhostIndex] = useState(0);
  const [paceGhostIndex, setPaceGhostIndex] = useState(0);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [recentKeyTimes, setRecentKeyTimes] = useState<number[]>([]);

  const [varianceGraph, setVarianceGraph] = useState<{ time: number; wpm: number }[]>([]);
  const [lastGraphUpdate, setLastGraphUpdate] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  // Standard Deviation calculation for Consistency
  const calculateConsistency = useCallback((latencies: number[]) => {
    if (latencies.length < 2) return 100;

    // Filter out large pauses (e.g., > 2s) which wreck consistency scores
    const activeLatencies = latencies.filter(l => l < 2000);
    if (activeLatencies.length < 2) return 100;

    const mean = activeLatencies.reduce((a, b) => a + b, 0) / activeLatencies.length;
    const variance = activeLatencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / activeLatencies.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of Variation (CV) = (Standard Deviation / Mean)
    const cv = stdDev / mean;
    // Use a non-linear decay so it doesn't hit 0 immediately for high variance
    // CV of 0.1 (very stable) -> 100/1.1 = ~91
    // CV of 0.5 (unstable) -> 100/1.5 = ~66
    // CV of 1.0 (very erratic) -> 100/2 = 50
    return Math.round(100 / (1 + cv));
  }, []);

  // Ghost Racing Logic
  useEffect(() => {
    if (startTime && !isFinished) {
      // PB Ghost
      if (ghostReplay && ghostIndex < ghostReplay.length) {
        const elapsed = Date.now() - startTime;
        const nextGhostEvent = ghostReplay[ghostIndex];
        if (elapsed >= nextGhostEvent.time) {
          setGhostIndex(prev => prev + 1);
        } else {
          const timeout = setTimeout(() => setGhostIndex(prev => prev + 1), nextGhostEvent.time - elapsed);
          return () => clearTimeout(timeout);
        }
      }

      // Pace Ghost
      if (settings.ghostWpm > 0) {
        const elapsed = Date.now() - startTime;
        const charsPerSecond = (settings.ghostWpm * 5) / 60;
        const expectedIndex = Math.floor((elapsed / 1000) * charsPerSecond);
        setPaceGhostIndex(Math.min(expectedIndex, text.length));
      }
    }
  }, [startTime, ghostReplay, ghostIndex, isFinished, settings.ghostWpm, text.length]);

  const calculateStats = useCallback((forceTime?: number) => {
    if (!startTime) return null;
    const endTime = Date.now();
    const durationSeconds = forceTime ?? (endTime - startTime) / 1000;

    if (durationSeconds <= 0) return null;

    const timeInMinutes = durationSeconds / 60;

    let correctChars = 0;
    let mistakes = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      } else {
        mistakes++;
      }
    }

    // Standard formulas
    const rawWpm = Math.round((userInput.length / 5) / timeInMinutes) || 0;
    // Net WPM
    const penalty = mistakes / timeInMinutes;
    const netWpm = Math.max(0, Math.round(rawWpm - penalty));

    // Efficiency WPM
    const wpm = Math.max(0, Math.round((correctChars / 5) / timeInMinutes)) || 0;
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

    const consistency = calculateConsistency(latencyHistory);

    return {
      wpm,
      rawWpm,
      netWpm,
      accuracy,
      mistakes,
      time: durationSeconds,
      keyPerformance,
      replay: recordedEvents,
      consistency,
      varianceGraph
    };
  }, [startTime, text, userInput, keyPerformance, recordedEvents, latencyHistory, varianceGraph, calculateConsistency]);

  const finishSession = useCallback((forceTime?: number) => {
    if (isFinished) return;
    const stats = calculateStats(forceTime);
    if (stats) {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onFinish(stats);
    }
  }, [isFinished, calculateStats, onFinish]);

  // Sync timeLeft with settings when not active
  useEffect(() => {
    if (!startTime) setTimeLeft(settings.duration);
  }, [settings.duration, startTime]);

  useEffect(() => {
    if (settings.mode === 'TIME' && startTime && timeLeft > 0 && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishSession(settings.duration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, settings.mode, timeLeft, isFinished, finishSession, settings.duration]);

  useEffect(() => {
    // Only finish if session has started (startTime is set) and user has typed the full text
    if (startTime && userInput.length === text.length && text.length > 0 && !isFinished) {
      finishSession();
    }
  }, [startTime, userInput.length, text.length, isFinished, finishSession]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onRestart();
      return;
    }
    if (isFinished) return;
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      setLastKeystrokeTime(performance.now());
      setLastGraphUpdate(now);
    }
    if (e.ctrlKey && e.key === 'Backspace') {
      e.preventDefault();
      setUserInput(prev => {
        const trimmed = prev.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        return lastSpace === -1 ? '' : prev.substring(0, lastSpace + 1);
      });
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;
    const nowPerf = performance.now();
    const nowWall = Date.now();

    if (val.length <= text.length) {
      playKeySound(settings.soundPack);
      const charIndex = val.length - 1;
      const expectedChar = text[charIndex];
      const actualChar = val[charIndex];
      const isCorrect = expectedChar === actualChar;

      // Sudden Death Logic
      if (settings.mode === 'SUDDEN_DEATH' && !isCorrect && actualChar !== undefined) {
        setIsFinished(true);
        // Force immediate finish
        const duration = (nowWall - (startTime || nowWall)) / 1000;
        onFinish({
          wpm: 0, rawWpm: 0, netWpm: 0, accuracy: 0, mistakes: 1, time: duration,
          keyPerformance, replay: recordedEvents, consistency: 0, varianceGraph: []
        });
        return;
      }

      // Record Event
      if (startTime) {
        const offset = nowWall - startTime;
        setRecordedEvents(prev => [...prev, { key: actualChar, time: offset, isCorrect, index: charIndex }]);

        // Update Variance Graph every 1s worth of typing (approx) or every 5 chars
        if (nowWall - lastGraphUpdate > 1000) {
          const timeMin = (nowWall - startTime) / 1000 / 60;
          const currentWpm = Math.round((val.length / 5) / timeMin);
          setVarianceGraph(prev => [...prev, { time: Math.round((nowWall - startTime) / 1000), wpm: currentWpm }]);
          setLastGraphUpdate(nowWall);
        }
      }

      if (lastKeystrokeTime !== null) {
        const latency = nowPerf - lastKeystrokeTime;
        // Only record latency as "Rhythm" if it's a valid interval (ignore > 2s pauses)
        if (latency < 2000) {
          setLatencyHistory(prev => [...prev, latency]);
        }

        setKeyPerformance(prev => {
          const stats = prev[expectedChar] || { latency: [], mistakes: {}, hits: 0 };
          if (isCorrect) {
            stats.latency.push(latency);
            stats.hits += 1;
          } else if (actualChar !== undefined) {
            stats.mistakes[actualChar] = (stats.mistakes[actualChar] || 0) + 1;
          }
          return { ...prev, [expectedChar]: { ...stats } };
        });
      }
      setUserInput(val);
      setLastKeystrokeTime(nowPerf);
      // Track recent key times for Heat
      setRecentKeyTimes(prev => [...prev.slice(-9), nowWall]);
    }
  };

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    window.addEventListener('keydown', focusInput);
    focusInput();
    return () => window.removeEventListener('keydown', focusInput);
  }, []);

  const progress = (userInput.length / text.length) * 100;
  const nextChar = text[userInput.length];

  const getCaretClass = () => {
    let base = "absolute transition-all duration-100 ";
    if (settings.caretAnimation === 'blink') base += "animate-caret ";
    if (settings.caretAnimation === 'smooth') base += "transition-all duration-150 ease-out ";

    switch (settings.caretStyle) {
      case 'line': return base + "left-0 top-0 w-[2px] h-full bg-current shadow-[0_0_10px_currentColor]";
      case 'block': return base + "left-0 top-0 w-full h-full bg-current opacity-30";
      case 'underline': return base + "left-0 bottom-[-2px] w-full h-[3px] bg-current";
      case 'outline': return base + "left-0 top-0 w-full h-full border-2 border-current opacity-50";
      default: return base;
    }
  };

  const getDensityClass = () => {
    switch (settings.density) {
      case 'compact': return "text-xl p-6 leading-normal";
      case 'relax': return "text-4xl p-14 leading-loose";
      default: return "text-3xl p-10 leading-relaxed"; // comfortable
    }
  };

  const isZen = settings.mode === 'ZEN';
  const isBlind = settings.mode === 'BLIND';
  const isCode = stage === StageType.CODE_MODE || settings.mode === 'CODE';
  // Funbox flags
  const isMirror = settings.mode === 'MIRROR';
  const isUpsideDown = settings.mode === 'UPSIDE_DOWN';
  const isReadAhead = settings.mode === 'READ_AHEAD';

  const isTerminal = settings.mode === 'TERMINAL';
  const isAscii = settings.mode === 'ASCII';

  // Heat Calculation: Based on instant WPM from recent 10 keystrokes
  const getInstantWpm = () => {
    if (recentKeyTimes.length < 2) return 0;
    const elapsedMs = recentKeyTimes[recentKeyTimes.length - 1] - recentKeyTimes[0];
    if (elapsedMs <= 0) return 0;
    const charsTyped = recentKeyTimes.length - 1;
    return Math.round((charsTyped / 5) / (elapsedMs / 60000));
  };

  const instantWpm = getInstantWpm();
  const juiceMultiplier = settings.juiceLevel === 'extreme' ? 1.5 : settings.juiceLevel === 'high' ? 1.2 : 1.0;
  const heatLevel = Math.min(5, Math.floor((instantWpm * juiceMultiplier) / 30));

  const getHeatClass = () => {
    if (settings.juiceLevel === 'none') return '';
    switch (heatLevel) {
      case 0: return 'text-sky-400';
      case 1: return 'text-blue-300';
      case 2: return 'text-white';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-500';
      case 5: return 'text-red-600 animate-pulse';
      default: return '';
    }
  };

  const isSmoking = heatLevel >= 4 && settings.juiceLevel !== 'none';

  // Read Ahead Logic: Find current word boundaries
  const currentWordStart = userInput.lastIndexOf(' ') + 1;
  const nextSpace = text.indexOf(' ', currentWordStart);
  const currentWordEnd = nextSpace === -1 ? text.length : nextSpace;

  const showKeymap = !isZen && settings.keymapMode !== 'off';
  const keymapTarget = settings.keymapMode === 'next' || settings.keymapMode === 'reactive' ? nextChar : undefined;

  return (
    <div className={`flex flex-col gap-8 w-full max-w-4xl mx-auto ${isZen ? 'py-20' : ''} ${settings.flipColors ? 'invert hue-rotate-180' : ''}`}>
      {!isZen && (
        <div className={`flex justify-between items-center mb-4 px-10 transition-opacity duration-500 ${isActive ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center gap-6">
            {settings.mode === 'TIME' ? (
              <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-black text-orange-500">{timeLeft}s</span>
              </div>
            ) : settings.mode === 'WORD' ? (
              <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
                <Hash className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-black text-indigo-500">{userInput.split(' ').filter(x => x).length} / {settings.wordCount}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-500/10 px-4 py-2 rounded-2xl border border-slate-500/20">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-black text-slate-400">Progress: {Math.round(progress)}%</span>
              </div>
            )}
            {ghostReplay && settings.showGhost && (
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                <Ghost className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase">Ghost PB Active</span>
              </div>
            )}
            {settings.mode === 'SUDDEN_DEATH' && (
              <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
                <span className="text-[10px] font-black text-red-500 uppercase">Sudden Death</span>
              </div>
            )}
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <InputLatencyChart latencies={latencyHistory} />
          </div>
        </div>
      )}

      <div className={`relative rounded-[2.5rem] ${getDensityClass()} ${isCode || isTerminal ? 'bg-black/90 font-mono shadow-blue-900/10 border-green-500/20' : 'bg-white/5 border-white/10'} ${!isZen ? 'shadow-2xl border' : ''} overflow-hidden transition-all duration-500 ${isMirror ? 'scale-x-[-1]' : ''} ${isUpsideDown ? 'scale-y-[-1]' : ''}`}>


        {isTerminal && (
          <span className="text-green-500 font-mono font-black mr-2 text-sm">user@zentype:~$</span>
        )}
        <div className={`${isCode || isTerminal ? 'text-green-400' : 'text-slate-600'} select-none mb-4 ${isAscii ? 'whitespace-pre font-mono' : 'whitespace-pre-wrap'} min-h-[140px] relative tracking-wide z-10`}>
          {text.split('').map((char, index) => {
            let className = "";
            let isCurrent = index === userInput.length;
            let isGhost = index === ghostIndex && ghostReplay && settings.showGhost;
            let isJustTyped = index === userInput.length - 1;

            // Blur Effect Logic
            const distance = index - userInput.length;
            const isFar = settings.blurEffect && (distance > 20 || distance < -20);
            const blurClass = isFar ? 'blur-[1px] opacity-20' : '';

            if (index < userInput.length) {
              const isCorrect = userInput[index] === text[index];
              if (isBlind) {
                className = "text-transparent"; // Hide typed text in Blind Mode
              } else {
                const baseClass = isCorrect ? (isCode || isTerminal ? "text-emerald-400" : "text-[var(--text-main)]") : "text-red-500/80 bg-red-500/10 rounded-md";
                className = isCorrect && settings.juiceLevel !== 'none' ? `${baseClass} ${getHeatClass()}` : baseClass;
              }
            }
            // For Blind Mode upcoming text:
            if (isBlind && index >= userInput.length) {
              className = isCode ? 'text-blue-200' : 'text-slate-600';
            }

            // Read Ahead: Hide current word
            if (isReadAhead && index >= currentWordStart && index < currentWordEnd) {
              className += " opacity-0";
            }

            return (
              <span key={index} className={`relative px-0.5 ${className} ${blurClass} transition-all duration-150`}>
                {char}
                {isCurrent && (
                  <span className={getCaretClass()} style={{ color: 'var(--caret-color)' }}></span>
                )}
                {isGhost && (
                  <span className="absolute left-[-1px] top-0 w-[2px] h-full bg-emerald-500/40 blur-[1px]"></span>
                )}
                {isJustTyped && userInput[index] === text[index] && (
                  // Particle component removed for performance
                  <span className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-75" style={{ animationDuration: '0.4s' }}></span>
                )}
                {settings.ghostWpm > 0 && index === paceGhostIndex && !isFinished && (
                  <span className="absolute left-[-1px] top-0 w-[2px] h-full bg-indigo-500/40 blur-[1px] animate-pulse"></span>
                )}
              </span>
            );
          })}
        </div>
        <input ref={inputRef} type="text" className="absolute opacity-0" value={userInput} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus />
      </div>

      {showKeymap && (
        <div className={`bg-slate-900/40 p-8 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md transition-opacity duration-500 ${isActive ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mapping Layer</span>
            {isFinished && <div className="text-emerald-500 font-black text-xs animate-pulse uppercase tracking-widest">Capture Finished</div>}
          </div>
          <VirtualKeyboard stage={stage} targetKey={keymapTarget} layout={settings.layout} theme={settings.keyboardTheme} />
        </div>
      )}
    </div>
  );
};

export default TypingArea;
