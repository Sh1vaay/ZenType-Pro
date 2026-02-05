import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, FileText, Quote, Code, Timer, Zap, Ghost, Monitor, Grid } from 'lucide-react';
import { TestMode } from '../types';

interface ModeSelectorDockProps {
    currentMode: TestMode;
    onModeSelect: (mode: TestMode) => void;
    onMore: () => void;
}

const MODES: { id: TestMode; icon: React.FC<any>; label: string; color: string }[] = [
    { id: 'CLASSIC', icon: Activity, label: 'Classic', color: '#4f46e5' },
    { id: 'TIME', icon: Timer, label: 'Time Attack', color: '#ec4899' },
    { id: 'WORD', icon: FileText, label: 'Word Count', color: '#10b981' },
    { id: 'QUOTE', icon: Quote, label: 'Quote', color: '#f59e0b' },
    { id: 'CODE', icon: Code, label: 'Code', color: '#6366f1' },
    { id: 'SUDDEN_DEATH', icon: Zap, label: 'Sudden Death', color: '#ef4444' },
    { id: 'ZEN', icon: Monitor, label: 'Zen', color: '#06b6d4' },
    { id: 'BLIND', icon: Ghost, label: 'Blind', color: '#8b5cf6' },
];

const ModeSelectorDock: React.FC<ModeSelectorDockProps> = ({ currentMode, onModeSelect, onMore }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-dock rounded-2xl p-2 flex items-end gap-2 isolate">
                {MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    const Icon = mode.icon;

                    return (
                        <motion.button
                            key={mode.id}
                            onClick={() => onModeSelect(mode.id)}
                            className="relative group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 outline-none"
                            initial={false}
                            whileHover={{
                                scale: 1.2,
                                translateY: -10,
                                zIndex: 10,
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div
                                className={`relative p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-white/20' : ''
                                    }`}
                                style={{
                                    color: isActive ? mode.color : '#94a3b8'
                                }}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                                {isActive && (
                                    <motion.div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                                        layoutId="activeDot"
                                    />
                                )}
                            </div>

                            {/* Tooltip */}
                            <motion.div
                                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold py-1 px-2 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 backdrop-blur-md"
                                initial={{ y: 5 }}
                                whileHover={{ y: 0 }}
                            >
                                {mode.label}
                            </motion.div>
                        </motion.button>
                    );
                })}

                <div className="w-px h-8 bg-white/10 mx-1 self-center" />

                {/* More Button */}
                <motion.button
                    onClick={onMore}
                    className="relative group flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 outline-none"
                    initial={false}
                    whileHover={{
                        scale: 1.2,
                        translateY: -10,
                        zIndex: 10,
                        backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative p-3 rounded-xl transition-all duration-300 text-slate-400 group-hover:text-white">
                        <Grid size={24} strokeWidth={2} />
                    </div>

                    <motion.div
                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold py-1 px-2 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 backdrop-blur-md"
                        initial={{ y: 5 }}
                        whileHover={{ y: 0 }}
                    >
                        More Modes
                    </motion.div>
                </motion.button>
            </div>
        </div>
    );
};

export default ModeSelectorDock;
