import React, { useEffect, useRef, useMemo } from 'react';

interface InputLatencyChartProps {
    latencies: number[];
    width?: number;
    height?: number;
    maxPoints?: number;
}

const InputLatencyChart: React.FC<InputLatencyChartProps> = ({ latencies, width = 200, height = 50, maxPoints = 50 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visibleData = latencies.slice(-maxPoints);

    const avgLatency = useMemo(() => {
        if (visibleData.length === 0) return 0;
        return Math.round(visibleData.reduce((a, b) => a + b, 0) / visibleData.length);
    }, [visibleData]);

    const maxLatency = useMemo(() => {
        if (visibleData.length === 0) return 0;
        return Math.max(...visibleData);
    }, [visibleData]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw background grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        if (visibleData.length < 2) return;

        // Draw chart
        const maxVal = Math.max(100, ...visibleData); // Min scale 0-100ms
        const xStep = width / (maxPoints - 1);

        ctx.beginPath();
        ctx.strokeStyle = '#22c55e'; // Green 500
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        visibleData.forEach((val, idx) => {
            const x = idx * xStep;
            const y = height - (val / maxVal) * height;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Fill gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

        ctx.lineTo((visibleData.length - 1) * xStep, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

    }, [visibleData, width, height, maxPoints]);

    return (
        <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
                <span className="text-xs font-black text-emerald-500">{avgLatency}ms</span>
                <span className="text-[9px] uppercase opacity-40">Rhythm (Avg)</span>
            </div>
            <canvas ref={canvasRef} width={width} height={height} className="opacity-80" />
            <div className="flex flex-col">
                <span className="text-[9px] opacity-40">{maxLatency}ms Max</span>
            </div>
        </div>
    );
};

export default InputLatencyChart;
