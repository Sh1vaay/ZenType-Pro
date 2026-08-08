import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface TutorialOverlayProps {
    onComplete: () => void;
}

const STEPS = [
    {
        title: "Welcome to ZenType Pro",
        description: "The ultimate progressive typing tutor designed for focus and flow.",
        target: "center"
    },
    {
        title: "Choose Your Mode",
        description: "Select from Classic, Time Attack, Sudden Death, and more using the dock below.",
        target: "bottom"
    },
    {
        title: "Customize Everything",
        description: "Access themes, fonts, and sound settings from the top bar.",
        target: "top-right"
    },
    {
        title: "Track Progress",
        description: "Gain XP, level up, and unlock rewards as you improve your typing speed.",
        target: "center"
    }
];

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const currentStep = STEPS[step];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px]" />

                    <h2 className="text-2xl font-black text-white mb-3">{currentStep.title}</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">{currentStep.description}</p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-indigo-500 w-6' : 'bg-slate-700'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-indigo-50 transition-all active:scale-95"
                        >
                            {step === STEPS.length - 1 ? 'Get Started' : 'Next'}
                            {step === STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TutorialOverlay;
