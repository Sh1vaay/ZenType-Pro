
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserStats, KeyPerformance, StageType } from '../types';
import VirtualKeyboard from './VirtualKeyboard';
import { TrendingUp, Target, Zap, AlertTriangle, ChevronRight, BarChart2, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
  stats: UserStats;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, onClose }) => {
  const chartData = useMemo(() => {
    return stats.history.slice().reverse().map((entry, index) => ({
      name: index + 1,
      wpm: entry.wpm,
      accuracy: entry.accuracy,
    }));
  }, [stats.history]);

  const aggregateKeyStats = useMemo(() => {
    const allStats: Record<string, { latencies: number[], mistakes: Record<string, number>, totalHits: number }> = {};

    stats.history.forEach(session => {
      if (!session.keyPerformance) return;
      (Object.entries(session.keyPerformance) as [string, KeyPerformance][]).forEach(([key, perf]) => {
        if (!allStats[key]) allStats[key] = { latencies: [], mistakes: {}, totalHits: 0 };
        allStats[key].latencies.push(...perf.latency);
        allStats[key].totalHits += perf.hits;
        (Object.entries(perf.mistakes) as [string, number][]).forEach(([mistake, count]) => {
          allStats[key].mistakes[mistake] = (allStats[key].mistakes[mistake] || 0) + count;
        });
      });
    });

    const analyzed = Object.entries(allStats).map(([key, data]) => ({
      key,
      avgLatency: data.latencies.length > 0 ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length : 0,
      totalMistakes: Object.values(data.mistakes).reduce((a, b) => a + b, 0),
      mostMistypedAs: Object.entries(data.mistakes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None',
      hits: data.totalHits
    }));

    return {
      problemKeys: analyzed.sort((a, b) => b.totalMistakes - a.totalMistakes).slice(0, 5),
      slowKeys: analyzed.filter(k => k.avgLatency > 0).sort((a, b) => b.avgLatency - a.avgLatency).slice(0, 5),
      heatmapData: analyzed
    };
  }, [stats.history]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <BarChart2 className="w-10 h-10 text-indigo-600" />
            Neural Analytics
          </h2>
          <p className="text-slate-500 font-medium mt-2">Historical performance mapping and cognitive motor analysis.</p>
        </div>
        <button onClick={onClose} className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2">
          Back to Terminal <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> WPM Progression
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="wpm" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorWpm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-8">
          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between">
            <Zap className="w-8 h-8 opacity-50" />
            <div>
              <div className="text-5xl font-black">{stats.highestWpm}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Global Record</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col justify-between">
            <Target className="w-8 h-8 text-emerald-500 opacity-50" />
            <div>
              <div className="text-5xl font-black text-slate-800">{stats.averageWpm}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Average</div>
            </div>
          </div>
          <div className="bg-orange-500 p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between">
            <Activity className="w-8 h-8 opacity-50" />
            <div>
              <div className="text-5xl font-black">{stats.streak?.current || 0}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Daily Streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Error Vectors
          </h3>
          <div className="space-y-4">
            {aggregateKeyStats.problemKeys.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-mono font-black text-lg text-slate-800 shadow-sm">
                    {item.key === ' ' ? 'SPC' : item.key}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Frequent Mistake</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Usually typed as '{item.mostMistypedAs}'</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-orange-600">{item.totalMistakes}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Misses</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" /> Latency Bottlenecks
          </h3>
          <div className="space-y-4">
            {aggregateKeyStats.slowKeys.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-mono font-black text-lg text-slate-800 shadow-sm">
                    {item.key === ' ' ? 'SPC' : item.key}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Cold Key</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Avg Latency: {Math.round(item.avgLatency)}ms</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-indigo-600">{Math.round(item.avgLatency)}ms</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Delay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-800">
        <div className="text-center mb-10">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Cognitive Heatmap</h3>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Orange = High Latency Focus Zone</p>
        </div>
        <VirtualKeyboard stage={StageType.PARAGRAPH_DEVELOPMENT} heatmapData={aggregateKeyStats.heatmapData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
