import React from 'react';

interface HandGuideProps {
    activeFinger: number | null; // 0-9 (Left Pinky to Right Pinky)
    visible: boolean;
}

const HandGuide: React.FC<HandGuideProps> = ({ activeFinger, visible }) => {
    if (!visible) return null;

    const leftHandFingers = [0, 1, 2, 3, 4]; // LP, LR, LM, LI, LT
    const rightHandFingers = [5, 6, 7, 8, 9]; // RT, RI, RM, RR, RP

    // SVG Paths for generic hands
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20 flex justify-between px-20 z-0">
            {/* Simple CSS shapes for hands for now, or SVG */}
            <svg width="800" height="300" viewBox="0 0 800 300" className="opacity-40">
                {/* Left Hand */}
                <g transform="translate(100, 50) scale(1.5)">
                    {/* Left Pinky */}
                    <path d="M10,80 Q5,100 10,120 L25,120 Q30,100 25,80 Z" fill={activeFinger === 0 ? '#6366f1' : '#334155'} />
                    {/* Left Ring */}
                    <path d="M30,50 Q25,80 30,110 L45,110 Q50,80 45,50 Z" fill={activeFinger === 1 ? '#6366f1' : '#334155'} />
                    {/* Left Middle */}
                    <path d="M55,30 Q50,70 55,110 L70,110 Q75,70 70,30 Z" fill={activeFinger === 2 ? '#6366f1' : '#334155'} />
                    {/* Left Index */}
                    <path d="M80,40 Q75,75 80,110 L95,110 Q100,75 95,40 Z" fill={activeFinger === 3 ? '#6366f1' : '#334155'} />
                    {/* Left Thumb */}
                    <path d="M110,90 Q100,110 120,130 L135,120 Q120,100 130,80 Z" fill={activeFinger === 4 ? '#6366f1' : '#334155'} />

                    {/* Palm */}
                    <path d="M10,120 Q50,160 95,110" stroke="#334155" fill="none" strokeWidth="2" />
                </g>

                {/* Right Hand */}
                <g transform="translate(500, 50) scale(1.5)">
                    {/* Right Thumb */}
                    <path d="M30,90 Q40,110 20,130 L5,120 Q20,100 10,80 Z" fill={activeFinger === 5 ? '#6366f1' : '#334155'} />
                    {/* Right Index */}
                    <path d="M50,40 Q55,75 50,110 L35,110 Q30,75 35,40 Z" fill={activeFinger === 6 ? '#6366f1' : '#334155'} />
                    {/* Right Middle */}
                    <path d="M75,30 Q80,70 75,110 L60,110 Q55,70 60,30 Z" fill={activeFinger === 7 ? '#6366f1' : '#334155'} />
                    {/* Right Ring */}
                    <path d="M100,50 Q105,80 100,110 L85,110 Q80,80 85,50 Z" fill={activeFinger === 8 ? '#6366f1' : '#334155'} />
                    {/* Right Pinky */}
                    <path d="M120,80 Q125,100 120,120 L105,120 Q100,100 105,80 Z" fill={activeFinger === 9 ? '#6366f1' : '#334155'} />
                </g>
            </svg>
        </div>
    );
};

export default HandGuide;
