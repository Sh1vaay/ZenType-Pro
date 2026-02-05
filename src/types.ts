
export enum StageType {
  SINGLE_LETTER = 'SINGLE_LETTER',
  DIGRAPHS_TRIGRAPHS = 'DIGRAPHS_TRIGRAPHS',
  BASIC_WORDS = 'BASIC_WORDS',
  LOWERCASE_PRACTICE = 'LOWERCASE_PRACTICE',
  UPPERCASE_PRACTICE = 'UPPERCASE_PRACTICE',
  NUMBER_PROFICIENCY = 'NUMBER_PROFICIENCY',
  SENTENCE_CONSTRUCTION = 'SENTENCE_CONSTRUCTION',
  PARAGRAPH_DEVELOPMENT = 'PARAGRAPH_DEVELOPMENT',
  QUOTE_MODE = 'QUOTE_MODE',
  CUSTOM_MODE = 'CUSTOM_MODE',
  CODE_MODE = 'CODE_MODE',
  LEFT_HAND = 'LEFT_HAND',
  RIGHT_HAND = 'RIGHT_HAND',
  PINKY_DRILL = 'PINKY_DRILL'
}

export type TestMode = 'TIME' | 'WORD' | 'CLASSIC' | 'ZEN' | 'SUDDEN_DEATH' | 'BLIND' | 'WEAK_SPOT' | 'CUSTOM' | 'QUOTE' | 'CODE' | 'MIRROR' | 'UPSIDE_DOWN' | 'READ_AHEAD' | 'TERMINAL' | 'ASCII';
export type CaretStyle = 'line' | 'block' | 'underline' | 'outline';
export type CaretAnimation = 'blink' | 'smooth' | 'solid';
export type SoundPack = 'none' | 'thocky' | 'typewriter' | 'click' | 'retro' | 'soft';
export type Theme = 'standard' | 'dark' | 'dracula' | 'gruvbox' | 'cyberpunk' | 'nebula' | 'zenith' | 'glass' | 'holo' | 'aurora';
export type Layout = 'qwerty' | 'dvorak' | 'colemak' | 'workman';
export type FontFamily = 'mono' | 'sans' | 'serif' | 'dyslexic';
export type TextDensity = 'compact' | 'comfortable' | 'relax';
export type KeymapMode = 'static' | 'reactive' | 'next' | 'off';

export interface KeystrokeEvent {
  key: string;
  time: number; // offset from start in ms
  isCorrect: boolean;
  index: number;
}

export interface Level {
  id: number;
  stage: StageType;
  title: string;
  description: string;
  objective: string;
  initialContent: string;
}

export interface KeyPerformance {
  latency: number[];
  mistakes: Record<string, number>;
  hits: number;
}

export interface TypingResult {
  levelId: number;
  levelTitle: string;
  wpm: number;
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  timeSeconds: number;
  mistakes: number;
  timestamp: number;
  consistency: number; // 0-100 score based on CV of inter-key latencies
  varianceGraph?: { time: number; wpm: number }[];
  keyPerformance?: Record<string, KeyPerformance>;
  replay?: KeystrokeEvent[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats, lastResult: TypingResult) => boolean;
}

export interface UserStats {
  totalLevelsCompleted: number;
  averageWpm: number;
  highestWpm: number;
  history: TypingResult[];
  personalBests: Record<number, number>;
  bestReplays: Record<number, KeystrokeEvent[]>;
  achievements: string[]; // IDs of unlocked achievements
  streak: {
    current: number;
    max: number;
    lastLoginDate: string; // ISO date string YYYY-MM-DD
  };
  advancedPBs: Record<string, number>; // Key: "MODE_DURATION_WORDCOUNT" etc. -> Value: WPM

  // Gamification
  experience: number;
  level: number;
  currency: number; // TypeCoins
  inventory: InventoryItem[];
  activeDailyQuests: Quest[];
}


export type KeyboardThemeVariant = 'default' | 'neon' | 'retro' | 'neumorphic' | 'aurora';

export interface SessionSettings {
  includePunctuation: boolean;
  includeNumbers: boolean;
  mode: TestMode;
  duration: 15 | 30 | 60;
  wordCount: 10 | 25 | 50;
  caretStyle: CaretStyle;
  caretAnimation: CaretAnimation;
  soundPack: SoundPack;
  theme: Theme;
  keyboardTheme: KeyboardThemeVariant;
  layout: Layout;
  showGhost: boolean;
  fontFamily: FontFamily;
  density: TextDensity;
  flipColors: boolean;
  blurEffect: boolean;
  keymapMode: KeymapMode;

  ghostWpm: number;
  metronomeBpm: number;
  metronomeOn: boolean;
  showHandGuide: boolean;
  juiceLevel: 'none' | 'low' | 'high' | 'extreme';
}

export interface Quest {
  id: string;
  description: string;
  reward: { xp: number; coins: number };
  progress: number;
  goal: number;
  type: 'wpm' | 'accuracy' | 'games' | 'perfect';
  completed: boolean;
}

export interface ShopItem {
  id: string;
  type: 'theme' | 'cursor' | 'booster' | 'font';
  name: string;
  description: string;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: string; // the actual theme key, font family, etc.
}

export interface InventoryItem {
  itemId: string;
  acquiredAt: number;
}

export interface ModeConfig {
  id: TestMode;
  name: string;
  description: string;
  icon: any; // Lucide icon
  color: string;
}
