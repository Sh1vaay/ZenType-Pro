
import React, { useState, useEffect, useRef } from 'react';
import { KeystrokeEvent } from '../types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ReplayViewerProps {
  text: string;
  replay: KeystrokeEvent[];
  onClose: () => void;
}

const ReplayViewer: React.FC<ReplayViewerProps> = ({ text, replay, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [replayedInput, setReplayedInput] = useState('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying && currentIndex < replay.length) {
      const nextEvent = replay[currentIndex];
      const prevTime = currentIndex === 0 ? 0 : replay[currentIndex - 1].time;
      const delay = (nextEvent.time - prevTime) / playbackSpeed;

      timerRef.current = setTimeout(() => {
        setReplayedInput(prev => text.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, delay);
    } else if (currentIndex >= replay.length) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentIndex, replay, text, playbackSpeed]);

  const reset = () => {
    setCurrentIndex(0);
    setReplayedInput('');
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-8">
      <div className="bg-slate-900 w-full max-w-4xl p-12 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white tracking-tight">Keystroke Replay</h2>
          <button onClick={onClose} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Exit</button>
        </div>

        <div className="bg-black/40 p-10 rounded-[2rem] border border-white/5 min-h-[200px] flex flex-col justify-center">
          <div className="text-3xl font-mono leading-relaxed whitespace-pre-wrap tracking-wide">
            {text.split('').map((char, i) => {
              let color = "text-slate-600";
              if (i < replayedInput.length) {
                color = "text-white";
              }
              const isCaret = i === replayedInput.length;
              return (
                <span key={i} className={`relative ${color}`}>
                  {char}
                  {isCaret && isPlaying && <span className="absolute left-0 top-0 w-[2px] h-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]"></span>}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button onClick={reset} className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20">
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <div className="flex-1">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Timeline</div>
             <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${(currentIndex / replay.length) * 100}%` }}></div>
             </div>
          </div>

          <div className="flex gap-2">
            {[0.5, 1, 2, 4].map(speed => (
              <button 
                key={speed} 
                onClick={() => setPlaybackSpeed(speed)} 
                className={`w-10 h-10 rounded-lg text-[10px] font-black border transition-all ${playbackSpeed === speed ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayViewer;
