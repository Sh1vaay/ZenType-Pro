import React from 'react';
import { X, Type, Music, Monitor, Keyboard, Eye, Zap, MousePointer } from 'lucide-react';
import { SessionSettings, Theme, FontFamily, SoundPack, CaretStyle, TextDensity, KeyboardThemeVariant } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: SessionSettings;
    onUpdate: (newSettings: Partial<SessionSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
    if (!isOpen) return null;

    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Icon size={18} />
                <h3 className="font-bold uppercase tracking-wider text-xs">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const Select = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: any) => void }) => (
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' ')}</option>
                ))}
            </select>
        </div>
    );

    const Toggle = ({ label, value, onChange }: { label: string, value: boolean, onChange: (val: boolean) => void }) => (
        <div
            onClick={() => onChange(!value)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${value ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
        >
            <span className={`text-sm font-medium ${value ? 'text-indigo-300' : 'text-slate-400'}`}>{label}</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0f172a]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-xl font-black text-white tracking-tight">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    <Section title="Visuals & Theme" icon={Monitor}>
                        <Select
                            label="Theme"
                            value={settings.theme}
                            options={['standard', 'dark', 'dracula', 'gruvbox', 'cyberpunk', 'nebula', 'zenith', 'glass', 'holo', 'aurora']}
                            onChange={(v) => onUpdate({ theme: v as Theme })}
                        />
                        <Select
                            label="Keyboard Style"
                            value={settings.keyboardTheme}
                            options={['default', 'neon', 'retro', 'neumorphic', 'aurora']}
                            onChange={(v) => onUpdate({ keyboardTheme: v as KeyboardThemeVariant })}
                        />
                        <Select
                            label="Text Density"
                            value={settings.density}
                            options={['compact', 'comfortable', 'relax']}
                            onChange={(v) => onUpdate({ density: v as TextDensity })}
                        />
                        <Toggle label="Blur Effects" value={settings.blurEffect} onChange={(v) => onUpdate({ blurEffect: v })} />
                        <Toggle label="Flip Colors" value={settings.flipColors} onChange={(v) => onUpdate({ flipColors: v })} />
                    </Section>

                    <Section title="Typography" icon={Type}>
                        <Select
                            label="Font Family"
                            value={settings.fontFamily}
                            options={['sans', 'mono', 'serif', 'dyslexic']}
                            onChange={(v) => onUpdate({ fontFamily: v as FontFamily })}
                        />
                        <Select
                            label="Caret Style"
                            value={settings.caretStyle}
                            options={['line', 'block', 'underline', 'outline']}
                            onChange={(v) => onUpdate({ caretStyle: v as CaretStyle })}
                        />
                        <Select
                            label="Caret Animation"
                            value={settings.caretAnimation}
                            options={['blink', 'smooth', 'solid']}
                            onChange={(v) => onUpdate({ caretAnimation: v })}
                        />
                    </Section>

                    <Section title="Sound & FX" icon={Music}>
                        <Select
                            label="Sound Pack"
                            value={settings.soundPack}
                            options={['none', 'thocky', 'typewriter', 'click', 'retro', 'soft']}
                            onChange={(v) => onUpdate({ soundPack: v as SoundPack })}
                        />
                        <Select
                            label="Juice Level"
                            value={settings.juiceLevel}
                            options={['none', 'low', 'high', 'extreme']}
                            onChange={(v) => onUpdate({ juiceLevel: v })}
                        />
                    </Section>

                    <Section title="Gameplay" icon={Keyboard}>
                        <Select
                            label="Keyboard Layout"
                            value={settings.layout}
                            options={['qwerty', 'dvorak', 'colemak', 'workman']}
                            onChange={(v) => onUpdate({ layout: v })}
                        />
                        <Toggle label="Show Ghost (PB)" value={settings.showGhost} onChange={(v) => onUpdate({ showGhost: v })} />
                        <Toggle label="Show Hand Guide" value={settings.showHandGuide} onChange={(v) => onUpdate({ showHandGuide: v })} />
                        <Toggle label="Punctuation" value={settings.includePunctuation} onChange={(v) => onUpdate({ includePunctuation: v })} />
                        <Toggle label="Numbers" value={settings.includeNumbers} onChange={(v) => onUpdate({ includeNumbers: v })} />
                        <Toggle label="Metronome" value={settings.metronomeOn} onChange={(v) => onUpdate({ metronomeOn: v })} />
                    </Section>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
