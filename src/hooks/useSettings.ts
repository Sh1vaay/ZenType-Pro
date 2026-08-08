import { useState, useEffect } from 'react';
import { SessionSettings } from '../types';

const loadSettings = (): SessionSettings => {
  try {
    const saved = localStorage.getItem('zentype_settings_v5');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
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

export const useSettings = () => {
  const [settings, setSettings] = useState<SessionSettings>(() => loadSettings());

  useEffect(() => {
    localStorage.setItem('zentype_settings_v5', JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings] as const;
};
