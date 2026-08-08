import React from 'react';
import { Trophy, Zap, Star } from 'lucide-react';

interface GamificationHUDProps {
    xp: number;
    level: number;
    streak: number;
    currency: number;
}

const GamificationHUD: React.FC<GamificationHUDProps> = ({ xp, level, streak, currency }) => {
    const xpForNextLevel = (level || 1) * 1000;
    const progress = Math.min(100, ((xp || 0) / xpForNextLevel) * 100);

    return (
        <div className="flex items-center gap-6 bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 shadow-lg">
            {/* Level Circle */}
            <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                    <circle cx="20" cy="20" r="18" stroke="#6366f1" strokeWidth="3" fill="none" strokeDasharray={113} strokeDashoffset={113 - (113 * progress) / 100} className="transition-all duration-1000" />
                </svg>
                <span className="font-black text-sm text-white">{level || 1}</span>
            </div>

            {/* XP Bar */}
            <div className="flex flex-col gap-1 w-32">
                <div className="flex justify-between text-[9px] font-black uppercase opacity-60 text-indigo-200">
                    <span>XP</span>
                    <span>{xp || 0} / {xpForNextLevel}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Currency */}
            <div className="flex items-center gap-2 text-yellow-400">
                <div className="bg-yellow-500/10 p-1.5 rounded-lg border border-yellow-500/20">
                    <Star className="w-4 h-4" fill="currentColor" />
                </div>
                <span className="font-black text-sm">{currency || 0}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 text-orange-400">
                <div className="bg-orange-500/10 p-1.5 rounded-lg border border-orange-500/20">
                    <Zap className="w-4 h-4" fill="currentColor" />
                </div>
                <span className="font-black text-sm">{streak || 0} Day Streak</span>
            </div>
        </div>
    );
};

export default React.memo(GamificationHUD);
