import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { LEVELS, LEVEL_CONTENT, QUOTES, CODE_SNIPPETS, ACHIEVEMENTS } from './constants';
import { UserStats, SessionSettings, KeyPerformance, StageType, TestMode, Theme, KeyboardThemeVariant, TypingResult, KeystrokeEvent } from './types';
import TypingArea from './components/TypingArea';
import StatsCard from './components/StatsCard';
import VirtualKeyboard from './components/VirtualKeyboard';
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
import ReplayViewer from './components/ReplayViewer';
import CommandPalette from './components/CommandPalette';
import Metronome from './components/Metronome';
import GamificationHUD from './components/GamificationHUD';
import Shop from './components/Shop';
import AnimatedBackground from './components/AnimatedBackground';
import TutorialOverlay from './components/TutorialOverlay';
import SettingsModal from './components/SettingsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, User, Settings, ShoppingBag, Clock, Keyboard, ArrowLeft, ArrowRight, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import ModeSelectorDock from './components/ModeSelectorDock';

const THEMES: Record<Theme, { bg: string, text: string, card: string, primary: string, caret: string }> = {
  standard: { bg: '#f8fafc', text: '#0f172a', card: '#ffffff', primary: '#4f46e5', caret: '#4f46e5' },
  dark: { bg: '#0f172a', text: '#f1f5f9', card: '#1e293b', primary: '#6366f1', caret: '#6366f1' },
  dracula: { bg: '#282a36', text: '#f8f8f2', card: '#44475a', primary: '#bd93f9', caret: '#ff79c6' },
  gruvbox: { bg: '#282828', text: '#ebdbb2', card: '#3c3836', primary: '#fabd2f', caret: '#fe8019' },
  cyberpunk: { bg: '#0b0c15', text: '#d6deeb', card: '#13141f', primary: '#f600ff', caret: '#00ffea' },
  nebula: { bg: '#030014', text: '#ffffff', card: 'rgba(255, 255, 255, 0.05)', primary: '#a855f7', caret: '#c084fc' },
  zenith: { bg: '#020617', text: '#ffffff', card: 'rgba(255, 255, 255, 0.03)', primary: '#3b82f6', caret: '#60a5fa' },
  glass: { bg: '#e0e7ff', text: '#1e1b4b', card: 'rgba(255, 255, 255, 0.25)', primary: '#4f46e5', caret: '#4f46e5' },
  holo: { bg: '#050510', text: '#e2e8f0', card: 'rgba(255, 255, 255, 0.07)', primary: '#22d3ee', caret: '#f472b6' },
  aurora: { bg: '#020617', text: '#f1f5f9', card: 'rgba(255, 255, 255, 0.05)', primary: '#10b981', caret: '#34d399' }
};

const loadStats = (): UserStats => {
  try {
    const saved = localStorage.getItem('zentype_stats_v5');
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return {
    totalLevelsCompleted: 0,
    averageWpm: 0,
    highestWpm: 0,
    history: [],
    personalBests: {},
    bestReplays: {},
    achievements: [],
    streak: { current: 0, max: 0, lastLoginDate: new Date().toISOString().split('T')[0] },
    advancedPBs: {},
    experience: 0,
    level: 1,
    currency: 0,
    inventory: [],
    activeDailyQuests: []
  };
};

const loadSettings = (): SessionSettings => {
  try {
    const saved = localStorage.getItem('zentype_settings_v5');
    if (saved) return JSON.parse(saved);
  } catch (e) { }
  return {
    includePunctuation: false,
    includeNumbers: false,
    mode: 'CLASSIC',
    duration: 60,
    wordCount: 25,
    caretStyle: 'line',
    caretAnimation: 'smooth',
    soundPack: 'thocky',
    theme: 'dark',
    keyboardTheme: 'default',
    layout: 'qwerty',
    showGhost: true,
    fontFamily: 'sans',
    density: 'comfortable',
    flipColors: false,
    blurEffect: false,
    keymapMode: 'reactive',
    ghostWpm: 60,
    metronomeBpm: 0,
    metronomeOn: false,
    showHandGuide: false,
    juiceLevel: 'low'
  };
};

const App: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<TestMode>('CLASSIC'); // Use TestMode string literals
  const [userInput, setUserInput] = useState('');
  const [sessionId, setSessionId] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(loadStats());
  const [showStats, setShowStats] = useState(false);
  const [settings, setSettings] = useState<SessionSettings>(loadSettings());
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [sessionText, setSessionText] = useState('');

  // New State
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  // Initialize Tutorial
  useEffect(() => {
    if (userStats.totalLevelsCompleted === 0 && !localStorage.getItem('zentype_tutorial_done')) {
      setShowTutorial(true);
    }
  }, []);

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('zentype_tutorial_done', 'true');
  };

  // Game state
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [isActive, setIsActive] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [keystrokeHistory, setKeystrokeHistory] = useState<KeystrokeEvent[]>([]);
  const [heatmapData, setHeatmapData] = useState<KeyPerformance[]>([]);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);

  useEffect(() => {
    localStorage.setItem('zentype_stats_v5', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('zentype_settings_v5', JSON.stringify(settings));
  }, [settings]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && settings.duration > 0 && currentMode === 'TIME') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleLevelComplete(); // Auto-finish
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, settings.duration, currentMode]);

  // Generate Content
  useEffect(() => {
    regenerateContent();
  }, [currentMode, currentLevelIndex]);

  const regenerateContent = useCallback(() => {
    let content = "Loading...";
    if (currentMode === 'CLASSIC') {
      content = LEVELS[currentLevelIndex]?.initialContent || "Error loading level";
    } else if (currentMode === 'QUOTE') {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      content = randomQuote;
    } else if (currentMode === 'CODE') {
      const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      content = randomSnippet;
    } else {
      // Default fallback
      content = "The quick brown fox jumps over the lazy dog. ".repeat(10);
    }
    setSessionText(content);
    // Reset state when content changes
    setUserInput('');
    setSessionId(prev => prev + 1);
    setStartTime(null);
    setIsActive(false);
    setMistakes(0);
    setWpm(0);
    setAccuracy(100);
    setKeystrokeHistory([]);
  }, [currentMode, currentLevelIndex]);

  const handleLevelComplete = useCallback((stats: any) => {
    setIsActive(false);

    const result: TypingResult = {
      levelId: currentMode === 'CLASSIC' ? LEVELS[currentLevelIndex].id : -1,
      levelTitle: currentMode === 'CLASSIC' ? LEVELS[currentLevelIndex].title : currentMode,
      wpm: stats.wpm,
      rawWpm: stats.rawWpm,
      netWpm: stats.netWpm,
      accuracy: stats.accuracy,
      timeSeconds: stats.time,
      mistakes: stats.mistakes,
      timestamp: Date.now(),
      consistency: stats.consistency,
      varianceGraph: stats.varianceGraph,
      replay: stats.replay,
      keyPerformance: stats.keyPerformance
    };

    setLastResult(result);
    // Update stats
    setUserStats(prev => ({
      ...prev,
      history: [result, ...prev.history].slice(0, 50),
      totalLevelsCompleted: prev.totalLevelsCompleted + 1,
      highestWpm: Math.max(prev.highestWpm, result.wpm),
      experience: (prev.experience || 0) + result.wpm,
      currency: (prev.currency || 0) + Math.floor(result.wpm / 10)
    }));

    setShowStats(true);
  }, [currentMode, currentLevelIndex]);

  const handleModeChange = useCallback((mode: TestMode) => {
    setCurrentMode(mode);
    setSettings(s => ({ ...s, mode }));
    setShowStats(false);
  }, []);

  const restartLevel = useCallback(() => {
    regenerateContent();
    setShowStats(false);
    setTimeLeft(settings.duration);
  }, [regenerateContent, settings.duration]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    }
    restartLevel();
  }, [currentLevelIndex, restartLevel]);

  const themeConfig = THEMES[settings.theme] || THEMES.standard;

  return (
    <div
      className={`min-h-screen transition-all duration-500 pb-32 selection:bg-indigo-500/30 selection:text-white relative font-${settings.fontFamily}`}
      style={{
        backgroundColor: themeConfig.bg,
        color: themeConfig.text,
        '--text-main': themeConfig.text,
        '--caret-color': themeConfig.caret
      } as any}
    >
      <AnimatedBackground />

      <ModeSelectorDock
        currentMode={currentMode}
        onModeSelect={handleModeChange}
        onMore={() => setShowCommandPalette(true)}
      />

      {/* Floating Navbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-4 pointer-events-none">
        <header className="glass-panel rounded-full px-6 py-3 flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Keyboard size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">ZenType</h1>
              <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest pl-0.5">Pro</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettings(s => ({ ...s, soundPack: s.soundPack === 'none' ? 'thocky' : 'none' }))}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white"
              title="Toggle Sound"
            >
              {settings.soundPack === 'none' ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, showHandGuide: !s.showHandGuide }))}
              className={`p-2 rounded-full hover:bg-white/10 transition-all ${settings.showHandGuide ? 'text-indigo-400' : 'text-slate-400'}`}
              title="Toggle Hand Guide"
            >
              {settings.showHandGuide ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            <button
              onClick={() => setShowStats(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white"
              title="View Stats & Progress"
            >
              <User size={18} />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-2">
              <Settings size={18} />
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            <button onClick={() => setShowShop(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
              <ShoppingBag size={14} className="text-yellow-400" />
              <span className="text-xs font-bold text-yellow-200">{userStats.currency || 0} TC</span>
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {!showStats ? (
            <motion.div
              key="typing-area"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 min-h-[60vh] justify-center"
            >
              <GamificationHUD
                xp={userStats.experience || 0}
                level={userStats.level || 1}
                streak={userStats.streak?.current || 0}
                currency={userStats.currency || 0}
              />

              <div className="glass-panel rounded-3xl p-1 shadow-2xl">
                <div className="bg-black/20 rounded-[22px] overflow-hidden backdrop-blur-sm">
                  <div className="flex justify-between items-center px-6 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex gap-4 text-xs font-mono font-medium opacity-60">
                      <div className="flex items-center gap-2">
                        <Activity size={12} />
                        {currentMode} Mode
                      </div>
                      {currentMode === 'TIME' && (
                        <div className="flex items-center gap-2">
                          <Clock size={12} />
                          {timeLeft}s
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Metronome Logic */}
                      <Metronome bpm={settings.metronomeBpm} isPlaying={isActive && settings.metronomeOn} />

                      {/* Level Selector */}
                      {currentMode === 'CLASSIC' && (
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5 mx-2">
                          <button
                            onClick={() => currentLevelIndex > 0 && setCurrentLevelIndex(p => p - 1)}
                            disabled={currentLevelIndex === 0}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <span className="text-[10px] font-bold px-2 min-w-[3ch] text-center">{currentLevelIndex + 1}</span>
                          <button
                            onClick={() => currentLevelIndex < LEVELS.length - 1 && setCurrentLevelIndex(p => p + 1)}
                            disabled={currentLevelIndex >= LEVELS.length - 1}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                          >
                            <ArrowRight size={10} />
                          </button>
                        </div>
                      )}

                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                  </div>

                  <div className="p-8 sm:p-12 relative">
                    <TypingArea
                      key={sessionId}
                      text={sessionText}
                      stage={currentMode === 'CLASSIC' ? (LEVELS[currentLevelIndex]?.stage || StageType.SINGLE_LETTER) : StageType.CUSTOM_MODE}
                      settings={settings}
                      isActive={isActive}
                      onFinish={handleLevelComplete}
                      onRestart={restartLevel}
                    />
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <VirtualKeyboard
                  stage={currentMode === 'CLASSIC' ? (LEVELS[currentLevelIndex]?.stage || StageType.SINGLE_LETTER) : StageType.CUSTOM_MODE}
                  targetKey={sessionText[userInput.length]}
                  layout={settings.layout}
                  heatmapData={heatmapData}
                  showHandGuide={settings.showHandGuide}
                  theme={settings.keyboardTheme}
                />
              </motion.div>

            </motion.div>
          ) : (
            <motion.div
              key="stats-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="max-w-4xl mx-auto">
                <button onClick={() => setShowStats(false)} className="mb-6 flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">
                  ← Back to Typing
                </button>

                {lastResult && (
                  <StatsCard
                    wpm={lastResult.wpm}
                    rawWpm={lastResult.rawWpm}
                    netWpm={lastResult.netWpm}
                    accuracy={lastResult.accuracy}
                    mistakes={lastResult.mistakes}
                    time={lastResult.timeSeconds}
                    consistency={lastResult.consistency}
                    varianceGraph={lastResult.varianceGraph}
                    onNext={nextLevel}
                    onRetry={restartLevel}
                    onWatchReplay={() => setShowReplay(true)}
                  />
                )}

                <div className="mt-8">
                  <Suspense fallback={<div className="text-center py-8 opacity-50">Loading analytics...</div>}>
                    <AnalyticsDashboard
                      stats={userStats}
                      onClose={() => setShowStats(false)}
                    />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          isOpen={showCommandPalette}
          settings={settings}
          onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
        />
      )}

      {showShop && (
        <Shop
          onClose={() => setShowShop(false)}
          currency={userStats.currency || 0}
          onPurchase={(id, cost) => {
            setUserStats(prev => ({ ...prev, currency: (prev.currency || 0) - cost }));
          }}
        />
      )}

      {showReplay && lastResult && (
        <ReplayViewer
          text={sessionText}
          replay={lastResult.replay || []}
          onClose={() => setShowReplay(false)}
        />
      )}

      {/* Overlays */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={(newS) => setSettings(s => ({ ...s, ...newS }))}
      />

      {showTutorial && <TutorialOverlay onComplete={completeTutorial} />}
    </div>
  );
};

export default App;
