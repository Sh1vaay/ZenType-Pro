import React from 'react';
import { StageType, Layout, KeyboardThemeVariant } from '../types';
import HandGuide from './HandGuide';

interface VirtualKeyboardProps {
  stage: StageType;
  targetKey?: string;
  layout?: Layout;
  heatmapData?: Array<{
    key: string;
    avgLatency: number;
    totalMistakes: number;
  }>;
  showHandGuide?: boolean;
  theme?: KeyboardThemeVariant;
}

const LAYOUTS: Record<Layout, string[][]> = {
  qwerty: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Space']
  ],
  dvorak: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
    ['Tab', "'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
    ['Caps', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
    ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'Shift'],
    ['Space']
  ],
  colemak: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']', '\\'],
    ['Caps', 'a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/', 'Shift'],
    ['Space']
  ],
  workman: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'd', 'r', 'w', 'b', 'j', 'f', 'u', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'h', 't', 'g', 'y', 'n', 'e', 'o', 'i', "'", 'Enter'],
    ['Shift', 'z', 'x', 'm', 'c', 'v', 'k', 'l', ',', '.', '/', 'Shift'],
    ['Space']
  ]
};

const THEME_STYLES: Record<KeyboardThemeVariant, {
  container: string;
  rowGap: string;
  keyBase: string; // Base styles for all keys
  keyActive: string;
  keyInactive: string;
  keyFocused: string; // Stage focused but not active
  widthMap: Record<string, string>;
}> = {
  default: {
    container: "bg-black/20 rounded-[2rem] p-6 shadow-2xl border border-white/5 backdrop-blur-xl",
    rowGap: "gap-2",
    keyBase: "rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 border border-t-white/10 border-b-black/20 relative z-10 flex items-center justify-center shadow-sm",
    keyActive: "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-95 z-20",
    keyInactive: "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white transition-colors",
    keyFocused: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]",
    widthMap: {
      default: "w-9 sm:w-12 h-10 sm:h-14",
      Backspace: "w-18 sm:w-24 px-2", Tab: "w-18 sm:w-24 px-2", Enter: "w-18 sm:w-24 px-2", Caps: "w-18 sm:w-24 px-2",
      Shift: "w-22 sm:w-32 px-2",
      Space: "w-48 sm:w-80"
    }
  },
  neon: {
    container: "bg-black/80 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.15)] border border-cyan-500/30 backdrop-blur-md",
    rowGap: "gap-2",
    keyBase: "rounded-sm text-[10px] sm:text-xs font-mono transition-all duration-150 border relative z-10 uppercase tracking-wider",
    keyActive: "bg-cyan-950/80 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] scale-105 z-20",
    keyInactive: "bg-black/50 text-cyan-900/50 border-cyan-900/30",
    keyFocused: "bg-cyan-900/20 text-cyan-600 border-cyan-700/50 shadow-[0_0_5px_rgba(34,211,238,0.2)]",
    widthMap: {
      default: "w-8 sm:w-11 h-9 sm:h-12",
      Backspace: "w-16 sm:w-24", Tab: "w-16 sm:w-24", Enter: "w-16 sm:w-24", Caps: "w-16 sm:w-24",
      Shift: "w-20 sm:w-28",
      Space: "w-40 sm:w-72"
    }
  },
  retro: {
    container: "bg-[#2c2c2c] rounded-lg shadow-2xl border-4 border-[#1a1a1a] p-8",
    rowGap: "gap-2",
    keyBase: "rounded-full text-[10px] sm:text-xs font-serif font-bold transition-all duration-100 border-b-4 relative z-10 flex items-center justify-center shadow-md",
    keyActive: "bg-[#f0f0f0] text-black border-[#999] translate-y-1 shadow-none z-20 ring-2 ring-white/50",
    keyInactive: "bg-[#1a1a1a] text-[#888] border-[#000] ring-1 ring-white/10",
    keyFocused: "bg-[#333] text-[#ddd] border-[#111] ring-1 ring-white/20",
    widthMap: {
      default: "w-9 sm:w-12 h-9 sm:h-12", // Slightly larger base for circular feel
      Backspace: "w-16 sm:w-24 rounded-full", Tab: "w-16 sm:w-24 rounded-full", Enter: "w-16 sm:w-24 rounded-full", Caps: "w-16 sm:w-24 rounded-full",
      Shift: "w-20 sm:w-28 rounded-full",
      Space: "w-40 sm:w-72 rounded-full"
    }
  },
  neumorphic: {
    container: "bg-[#e0e5ec] rounded-3xl p-8 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]",
    rowGap: "gap-3",
    keyBase: "rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 relative z-10 flex items-center justify-center text-[#4a5568] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]",
    keyActive: "shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] scale-95 text-[#4a5568]",
    keyInactive: "opacity-60",
    keyFocused: "shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]",
    widthMap: {
      default: "w-10 sm:w-14 h-10 sm:h-14",
      Backspace: "w-20 sm:w-28", Tab: "w-20 sm:w-28", Enter: "w-20 sm:w-28", Caps: "w-20 sm:w-28",
      Shift: "w-24 sm:w-32",
      Space: "w-48 sm:w-80"
    }
  },
  aurora: {
    container: "bg-[#0a0a0a] relative overflow-hidden rounded-3xl border border-white/10",
    rowGap: "gap-2",
    keyBase: "rounded-lg text-[10px] sm:text-xs font-mono font-thin transition-all duration-150 relative z-10 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/30 text-white shadow-none",
    keyActive: "bg-white text-black shadow-[0_0_20px_2px_rgba(255,255,255,0.6)] scale-95 border-transparent duration-75",
    keyInactive: "opacity-40",
    keyFocused: "bg-white/10 border-white/50 shadow-[0_0_10px_rgba(255,255,255,0.1)]",
    widthMap: {
      default: "w-9 sm:w-12 h-9 sm:h-12",
      Backspace: "w-18 sm:w-26", Tab: "w-18 sm:w-26", Enter: "w-18 sm:w-26", Caps: "w-18 sm:w-26",
      Shift: "w-22 sm:w-30",
      Space: "w-44 sm:w-76"
    }
  }
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ stage, targetKey, layout = 'qwerty', heatmapData, showHandGuide = false, theme = 'default' }) => {
  const rows = LAYOUTS[layout] || LAYOUTS.qwerty;
  const currentTheme = THEME_STYLES[theme] || THEME_STYLES.default;

  const getFingerForKey = (key: string): number | null => {
    if (!key) return null;
    const k = key.toLowerCase();

    // 0: LP, 1: LR, 2: LM, 3: LI, 4: LT
    // 5: RT, 6: RI, 7: RM, 8: RR, 9: RP

    // Left Hand
    if (['`', '1', 'q', 'a', 'z', 'tab', 'caps', 'shift'].includes(k)) return 0;
    if (['2', 'w', 's', 'x'].includes(k)) return 1;
    if (['3', 'e', 'd', 'c'].includes(k)) return 2;
    if (['4', 'r', 'f', 'v', '5', 't', 'g', 'b'].includes(k)) return 3;
    if (['space'].includes(k)) return 5;

    // Right Hand
    if (['6', 'y', 'h', 'n', '7', 'u', 'j', 'm'].includes(k)) return 6;
    if (['8', 'i', 'k', ','].includes(k)) return 7;
    if (['9', 'o', 'l', '.'].includes(k)) return 8;
    if (['0', 'p', ';', '/', '-', '=', '[', ']', '\\', "'", 'enter', 'backspace'].includes(k)) return 9;

    return null;
  };

  const activeFinger = targetKey ? getFingerForKey(targetKey) : null;

  const isKeyActive = (keyLabel: string, target?: string): boolean => {
    if (!target) return false;
    const normalizedTarget = target.toLowerCase();
    const normalizedKey = keyLabel.toLowerCase();
    const shiftedSymbols: Record<string, string> = {
      '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
      '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };
    if (normalizedTarget === normalizedKey && keyLabel.length === 1) return true;
    if (target === ' ' && keyLabel === 'Space') return true;
    if (shiftedSymbols[target] === keyLabel) return true;
    if (keyLabel === 'Shift') {
      const isUppercaseLetter = target !== target.toLowerCase() && !shiftedSymbols[target];
      const isShiftedSymbol = !!shiftedSymbols[target];
      return isUppercaseLetter || isShiftedSymbol;
    }
    return false;
  };

  const stageFocusedKeys = (stage: StageType): string[] => {
    switch (stage) {
      case StageType.SINGLE_LETTER: return ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
      case StageType.DIGRAPHS_TRIGRAPHS: return ['t', 'h', 'i', 'n', 'g', 'a', 'd'];
      case StageType.NUMBER_PROFICIENCY: return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      default: return [];
    }
  };

  const focused = stageFocusedKeys(stage);

  const getKeyHeatmapColor = (keyLabel: string) => {
    if (!heatmapData) return null;
    const normalizedKey = keyLabel === 'Space' ? ' ' : keyLabel.toLowerCase();
    const data = heatmapData.find(d => d.key.toLowerCase() === normalizedKey);
    if (!data || data.avgLatency === 0) return null;
    const normalizedLatency = Math.min(Math.max((data.avgLatency - 100) / 500, 0), 1);
    const r = Math.round(51 + (249 - 51) * normalizedLatency);
    const g = Math.round(65 + (115 - 65) * normalizedLatency);
    const b = Math.round(85 + (22 - 85) * normalizedLatency);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className={`relative flex flex-col ${currentTheme.rowGap} p-6 w-full max-w-3xl mx-auto overflow-hidden ${currentTheme.container}`} aria-hidden="true">
      {theme === 'aurora' && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-cyan-500/30 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[80px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[30%] w-64 h-64 bg-lime-500/20 rounded-full blur-[60px] animate-pulse delay-700" />
        </>
      )}
      <HandGuide activeFinger={activeFinger} visible={showHandGuide} />
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex ${currentTheme.rowGap} justify-center`}>
          {row.map((key, index) => {
            const isActive = isKeyActive(key, targetKey);
            const isStageFocused = focused.includes(key);
            const heatmapColor = getKeyHeatmapColor(key);

            let widthClass = currentTheme.widthMap.default;
            if (key === 'Backspace') widthClass = currentTheme.widthMap.Backspace;
            if (key === 'Tab') widthClass = currentTheme.widthMap.Tab;
            if (key === 'Enter') widthClass = currentTheme.widthMap.Enter;
            if (key === 'Caps') widthClass = currentTheme.widthMap.Caps;
            if (key === 'Shift') widthClass = currentTheme.widthMap.Shift;
            if (key === 'Space') widthClass = currentTheme.widthMap.Space;


            const stateClass = isActive
              ? currentTheme.keyActive
              : isStageFocused && !heatmapData
                ? currentTheme.keyFocused
                : !heatmapColor ? currentTheme.keyInactive : '';

            // Heatmap override styles if applicable
            const customStyle = heatmapColor ? { backgroundColor: heatmapColor, borderColor: 'rgba(0,0,0,0.3)', color: 'white' } : {};

            return (
              <div
                key={`${key}-${rowIndex}-${index}`} // Fix: Use unique key for duplicate buttons (e.g. Shift)
                style={customStyle}
                className={`${currentTheme.keyBase} ${stateClass} ${widthClass} flex items-center justify-center`}
              >
                {key === 'Backspace' ? '⌫' : key === 'Enter' ? '↵' : key === 'Tab' ? '⇥' : key}

              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Custom areEqual to avoid re-renders when only heatmapData changes during typing
const areEqual = (prevProps: VirtualKeyboardProps, nextProps: VirtualKeyboardProps) => {
  return (
    prevProps.targetKey === nextProps.targetKey &&
    prevProps.stage === nextProps.stage &&
    prevProps.layout === nextProps.layout &&
    prevProps.theme === nextProps.theme &&
    prevProps.showHandGuide === nextProps.showHandGuide
  );
};

export default React.memo(VirtualKeyboard, areEqual);
