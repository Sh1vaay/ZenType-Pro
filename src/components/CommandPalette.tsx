import React, { useState, useEffect, useRef } from 'react';
import { Command, Search } from 'lucide-react';
import { SessionSettings, Theme, FontFamily } from '../types';

interface CommandPaletteProps {
    settings: SessionSettings;
    onUpdateSettings: (newSettings: Partial<SessionSettings>) => void;
    isOpen: boolean;
    onClose: () => void;
}

const COMMANDS = [
    { id: 'theme-standard', label: 'Theme: Standard', action: (s: any) => ({ theme: 'standard' }) },
    { id: 'theme-dark', label: 'Theme: Dark', action: (s: any) => ({ theme: 'dark' }) },
    { id: 'theme-dracula', label: 'Theme: Dracula', action: (s: any) => ({ theme: 'dracula' }) },
    { id: 'theme-gruvbox', label: 'Theme: Gruvbox', action: (s: any) => ({ theme: 'gruvbox' }) },
    { id: 'theme-cyberpunk', label: 'Theme: Cyberpunk', action: (s: any) => ({ theme: 'cyberpunk' }) },

    { id: 'font-sans', label: 'Font: Sans', action: (s: any) => ({ fontFamily: 'sans' }) },
    { id: 'font-mono', label: 'Font: Mono', action: (s: any) => ({ fontFamily: 'mono' }) },
    { id: 'font-serif', label: 'Font: Serif', action: (s: any) => ({ fontFamily: 'serif' }) },

    { id: 'ghost-on', label: 'Ghost: On', action: (s: any) => ({ showGhost: true }) },
    { id: 'ghost-off', label: 'Ghost: Off', action: (s: any) => ({ showGhost: false }) },

    { id: 'sound-thocky', label: 'Sound: Thocky', action: (s: any) => ({ soundPack: 'thocky' }) },
    { id: 'sound-typewriter', label: 'Sound: Typewriter', action: (s: any) => ({ soundPack: 'typewriter' }) },
    { id: 'sound-off', label: 'Sound: Off', action: (s: any) => ({ soundPack: 'none' }) },

    { id: 'hand-on', label: 'Hand Guide: On', action: (s: any) => ({ showHandGuide: true }) },
    { id: 'hand-off', label: 'Hand Guide: Off', action: (s: any) => ({ showHandGuide: false }) },
    { id: 'metro-60', label: 'Metronome: 60 BPM', action: (s: any) => ({ metronomeBpm: 60, metronomeOn: true }) },
    { id: 'metro-90', label: 'Metronome: 90 BPM', action: (s: any) => ({ metronomeBpm: 90, metronomeOn: true }) },
    { id: 'metro-120', label: 'Metronome: 120 BPM', action: (s: any) => ({ metronomeBpm: 120, metronomeOn: true }) },
    { id: 'metro-off', label: 'Metronome: Off', action: (s: any) => ({ metronomeBpm: 0, metronomeOn: false }) },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ settings, onUpdateSettings, isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(filteredCommands[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const executeCommand = (cmd: typeof COMMANDS[0]) => {
        if (cmd) {
            const updates = cmd.action(settings);
            onUpdateSettings(updates);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                    <Command className="w-5 h-5 text-indigo-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command..."
                        className="bg-transparent border-none outline-none text-lg flex-1 placeholder:text-slate-500"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredCommands.map((cmd, idx) => (
                        <button
                            key={cmd.id}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full text-left px-6 py-3 flex items-center justify-between transition-colors ${idx === selectedIndex ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            <span>{cmd.label}</span>
                            {idx === selectedIndex && <span className="text-xs opacity-60">Enter to select</span>}
                        </button>
                    ))}
                    {filteredCommands.length === 0 && (
                        <div className="px-6 py-8 text-center text-slate-500">
                            No commands found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
