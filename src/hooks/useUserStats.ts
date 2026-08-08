import { useState, useEffect } from 'react';
import { UserStats } from '../types';

const loadStats = (): UserStats => {
  try {
    const saved = localStorage.getItem('zentype_stats_v5');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
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

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>(() => loadStats());

  useEffect(() => {
    localStorage.setItem('zentype_stats_v5', JSON.stringify(userStats));
  }, [userStats]);

  return [userStats, setUserStats] as const;
};
