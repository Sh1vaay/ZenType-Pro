import React, { useMemo } from 'react';
import { Eye, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface StatsCardProps {
  wpm: number;
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  time: number;
  consistency: number;
  varianceGraph?: { time: number; wpm: number }[];
  onNext: () => void;
  onRetry: () => void;
  onWatchReplay: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ wpm, rawWpm, netWpm, accuracy, mistakes, time, consistency, varianceGraph, onNext, onRetry, onWatchReplay }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 border border-white/10 animate-in fade-in zoom-in duration-500" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <h2 className="text-4xl font-black mb-10 text-center uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Post-Session Audit</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-center shadow-2xl shadow-indigo-900/20 col-span-2 md:col-span-1 flex flex-col justify-center">
          <div className="text-white text-5xl font-black mb-1">{netWpm}</div>
          <div className="text-indigo-100 text-[9px] font-black uppercase tracking-[0.2em]">Net WPM</div>
        </div>
        <div className="bg-black/5 p-6 rounded-[2rem] text-center border border-black/5 dark:bg-white/5 dark:border-white/5 flex flex-col justify-center">
          <div className="text-4xl font-black mb-1" style={{ color: 'var(--text-main)' }}>{accuracy}%</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-main)' }}>Accuracy</div>
        </div>
        <div className="bg-black/5 p-6 rounded-[2rem] text-center border border-black/5 dark:bg-white/5 dark:border-white/5 flex flex-col justify-center">
          <div className="text-gray-500 text-4xl font-black mb-1">{rawWpm}</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-main)' }}>Raw Speed</div>
        </div>
        <div className="bg-black/5 p-6 rounded-[2rem] text-center border border-black/5 dark:bg-white/5 dark:border-white/5 flex flex-col justify-center">
          <div className="text-orange-500 text-4xl font-black mb-1">{mistakes}</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-main)' }}>Errors</div>
        </div>
        <div className="bg-black/5 p-6 rounded-[2rem] text-center border border-black/5 dark:bg-white/5 dark:border-white/5 flex flex-col justify-center">
          <div className={`text-4xl font-black mb-1 ${consistency >= 80 ? 'text-emerald-500' : 'text-yellow-500'}`}>{consistency}%</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-main)' }}>Consistency</div>
        </div>
      </div>

      {varianceGraph && varianceGraph.length > 2 && (
        <div className="mb-8 p-6 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-transparent dark:border-white/5">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Speed Variance Flow</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={varianceGraph}>
                <Line type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={3} dot={false} isAnimationActive={true} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <button onClick={onWatchReplay} className="w-full mb-8 p-6 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-[2rem] border border-transparent dark:border-white/10 flex items-center justify-center gap-4 group transition-all" style={{ color: 'var(--text-main)' }}>
        <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-xi font-black uppercase tracking-widest">Review Keystroke Replay</span>
      </button>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onRetry} className="flex-1 px-8 py-5 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 font-black text-[10px] uppercase tracking-widest rounded-3xl transition-all" style={{ color: 'var(--text-main)' }}>
          Re-initialize Run
        </button>
        <button onClick={onNext} className="flex-1 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-indigo-900/30">
          Sync Progress
        </button>
      </div>
    </div>
  );
};

export default StatsCard;
