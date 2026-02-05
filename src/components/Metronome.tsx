import React, { useEffect, useRef } from 'react';
import { playMetronomeTick } from '../services/soundEngine';

interface MetronomeProps {
    bpm: number;
    isPlaying: boolean;
}

const Metronome: React.FC<MetronomeProps> = ({ bpm, isPlaying }) => {
    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (isPlaying && bpm > 0) {
            const intervalMs = (60 / bpm) * 1000;
            timerRef.current = setInterval(() => {
                playMetronomeTick();
            }, intervalMs);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [bpm, isPlaying]);

    return null; // Logic only component
};

export default React.memo(Metronome);
